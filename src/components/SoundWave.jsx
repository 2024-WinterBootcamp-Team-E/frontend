import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js'; // v6 경로
import styled from 'styled-components';
import PlayButton from '@/components/PlayButton';
import RecordButton from '@/components/RecordButton';
import { useRecordStore } from '@/store'; // zustand 스토어 import
import { postWithReadableStream } from '@/api';

const SoundWave = ({ sentenceId, onScoreUpdate, onSSEUpdate, onResetFeedback }) => {
	const [isPlaying, setIsPlaying] = useState(false); // 재생 상태를 관리
	const [isRecording, setIsRecording] = useState(false); // 녹음 상태를 관리
	const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스
	const audioChunksRef = useRef([]);
	const containerRef = useRef(null); // WaveSurfer가 렌더링될 DOM 참조
	const waveSurferRef = useRef(null); // WaveSurfer 인스턴스를 저장
	const microphoneRef = useRef(null); // 마이크로폰 플러그인 인스턴스
	const userId = sessionStorage.getItem('userId'); // 유저id 가져오는 함수

	// 스토어에서 오디오 파일 상태와 메서드 가져오기
	const { recordedAudio, setRecordedAudio } = useRecordStore();

	useEffect(() => {
		if (waveSurferRef.current) {
			waveSurferRef.current.destroy();
		}

		// WaveSurfer 초기화
		waveSurferRef.current = WaveSurfer.create({
			container: containerRef.current,
			waveColor: '#11317d',
			progressColor: '#b1c5f6',
			cursorColor: '#3267e3',
			height: 80,
			responsive: true,
			barWidth: 4,
			barGap: 2,
			barRadius: 4,
			plugins: [
				MicrophonePlugin.create(), // 마이크로폰 플러그인 추가
			],
		});

		// 마이크로폰 플러그인 인스턴스 가져오기
		microphoneRef.current = waveSurferRef.current.microphone;

		// 재생이 끝났을 때 isPlaying을 false로 설정
		waveSurferRef.current.on('finish', () => {
			setIsPlaying(false);
		});

		// 컴포넌트 언마운트 시 WaveSurfer 정리
		return () => {
			waveSurferRef.current?.destroy();
		};
	}, [sentenceId]);

	useEffect(() => {
		let audioURL;
		if (recordedAudio && !isRecording) {
			// 녹음이 완료되고 녹음 중이 아닐 때만 로드
			audioURL = URL.createObjectURL(recordedAudio);
			waveSurferRef.current.load(audioURL);
		} else {
			// 녹음 중일 때는 빈 파형으로 유지
			if (waveSurferRef.current) {
				waveSurferRef.current.empty();
			}
		}

		// URL 객체 해제하여 메모리 누수 방지
		return () => {
			if (audioURL) {
				URL.revokeObjectURL(audioURL);
			}
		};
	}, [recordedAudio, isRecording]);

	const handlePlay = () => {
		if (waveSurferRef.current) {
			waveSurferRef.current.playPause(); // 재생/일시정지 상태를 토글
			setIsPlaying((prev) => !prev); // 재생 상태 업데이트
		}
	};

	const handleStartRecording = async () => {
		try {
			// 새로운 녹음에 앞서 부모 컴포넌트에서 피드백 텍스트 초기화
			if (onResetFeedback) onResetFeedback();

			// 마이크로폰 플러그인 시작
			microphoneRef.current.start();

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			// 녹음 데이터 초기화
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
				setRecordedAudio(audioBlob);
				console.log('녹음이 완료되었습니다.');

				// 마이크로폰 플러그인 정지
				microphoneRef.current.stop();

				// 녹음된 오디오로 WaveSurfer 로드
				if (waveSurferRef.current) {
					const audioURL = URL.createObjectURL(audioBlob);
					waveSurferRef.current.load(audioURL);
				}

				// handlePostFeedback 호출
				handlePostFeedback(audioBlob);
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const handleStopRecording = () => {
		mediaRecorderRef.current?.stop();
		setIsRecording(false);
	};

	const handlePostFeedback = async (audioBlob) => {
		if (!audioBlob) {
			console.error('녹음된 오디오가 없습니다.');
			return;
		}

		if (!sentenceId) {
			console.error('유효한 sentenceId가 제공되지 않았습니다.');
			return;
		}

		// FormData 객체 생성
		const formData = new FormData();
		formData.append('audio_file', audioBlob);

		try {
			await postWithReadableStream(`/feedback/${userId}/${sentenceId}`, formData, true, (chunk) => {
				// pronscore와 SSE 데이터 구분 처리
				chunk.split('\n\n').forEach((part) => {
					if (!part) return;
					if (part.startsWith('pronscore:')) {
						const scoreStr = part.replace('pronscore:', '').trim();
						const scoreValue = Number(scoreStr);
						if (onScoreUpdate) onScoreUpdate(scoreValue);
					} else if (part.startsWith('data:')) {
						const dataStr = part.replace('data: ', '');
						if (onSSEUpdate) onSSEUpdate(dataStr);
					}
					// 핵심: result: 가 들어온 경우 (거대한 JSON 파싱)
					else if (part.startsWith('result:')) {
						const jsonString = part.replace('result:', '').trim();
						try {
							const parsedData = JSON.parse(jsonString);
							// PStudy로 JSON 결과 전달 (props 활용)
							onSSEUpdate && onSSEUpdate(parsedData, 'result');
						} catch (parseError) {
							console.error('JSON 파싱 실패:', parseError);
						}
					}
				});
			});
			console.log('스트림 처리 완료');
		} catch (error) {
			console.error('오디오 업로드 또는 스트림 처리 오류:', error);
		}
	};

	return (
		<Container>
			<RecordButton onClick={isRecording ? handleStopRecording : handleStartRecording} />
			<PlayButton isPlaying={isPlaying} onClick={handlePlay} />
			<WaveContainer ref={containerRef} />
		</Container>
	);
};

export default SoundWave;

const Container = styled.div`
	align-items: center;
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
	height: 100%;
	justify-content: center;
	max-width: 40rem;
	width: 100%;
`;

const WaveContainer = styled.div`
	background-color: transparent;
	height: 4rem;
	margin: 0;
	width: 40rem;
`;
