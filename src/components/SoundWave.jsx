import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import styled from 'styled-components';
import PlayButton from '@/components/PlayButton';
import RecordButton from '@/components/RecordButton';
import { useRecordStore } from '@/store'; // zustand 스토어 import
import { post } from '@/api';

const SoundWave = () => {
	const [isPlaying, setIsPlaying] = useState(false); // 재생 상태를 관리
	const [isRecording, setIsRecording] = useState(false); // 녹음 상태를 관리
	const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스
	const audioChunksRef = useRef([]);
	const containerRef = useRef(null); // WaveSurfer가 렌더링될 DOM 참조
	const waveSurferRef = useRef(null); // WaveSurfer 인스턴스를 저장
	const userId = sessionStorage.getItem('userId'); // 유저id 가져오는 함수
	const sentenceId = 2;

	// 스토어에서 오디오 파일 상태와 메서드 가져오기
	const { recordedAudio, setRecordedAudio } = useRecordStore();

	useEffect(() => {
		// WaveSurfer 인스턴스를 초기화
		if (containerRef.current) {
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
			});

			// 재생이 끝났을 때 isPlaying을 false로 설정
			waveSurferRef.current.on('finish', () => {
				setIsPlaying(false);
			});

			// 컴포넌트 언마운트 시 WaveSurfer 정리
			return () => {
				waveSurferRef.current.destroy();
			};
		}
	}, []);

	useEffect(() => {
		// 스토어의 recordedAudio 변경 시 WaveSurfer에 로드
		if (recordedAudio && waveSurferRef.current) {
			const audioURL = URL.createObjectURL(recordedAudio);
			waveSurferRef.current.load(audioURL);
		}
	}, [recordedAudio]);

	const handlePlay = () => {
		if (waveSurferRef.current) {
			waveSurferRef.current.playPause(); // 재생/일시정지 상태를 토글
			setIsPlaying((prev) => !prev); // 재생 상태 업데이트
		}
	};

	const handleStartRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			// 녹음 데이터 초기화
			audioChunksRef.current = [];

			// 녹음 데이터 수집
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				// 녹음 데이터로 Blob 생성
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

				// zustand 스토어에 저장
				setRecordedAudio(audioBlob);
				try {
					const formData = new FormData();
					formData.append('audio_file', audioBlob); // Blob과 파일 이름 설정
					const response = await post(`/feedback/${userId}/${sentenceId}`, formData, true);
					console.log('서버 응답:', response);
					// 현재는 api 오류로 동작하지 않지만, 오류 해결 후 response에 score 추가되면 zustand로 reponse를 저장해서 PStudy 페이지에서 점수를 받아 evaluation 값을 set 할 수 있도록 수정할 것.
				} catch (error) {
					console.error('Error posting feedback:', error);
				}
			};

			// 녹음 시작
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

	const handlePostFeedback = async () => {
		if (!recordedAudio) {
			console.error('녹음된 오디오가 없습니다.');
			return;
		}

		// FormData 객체 생성
		const formData = new FormData();
		formData.append('audio_file', recordedAudio, 'recordedAudio.wav'); // Blob과 파일 이름 추가

		try {
			// POST 요청 보내기
			const response = await post(`/feedback/${userId}/${sentenceId}`, formData, true);
			console.log('서버 응답:', response);
		} catch (error) {
			console.error('Error posting feedback:', error);
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