import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';
import PlayButton from '@/components/PlayButton';
import RecordButton from '@/components/RecordButton';
import { useRecordStore } from '@/store'; // zustand 스토어 import
import { postWithReadableStream } from '@/api';

const SoundWave = () => {
	const [isPlaying, setIsPlaying] = useState(false); // 재생 상태를 관리
	const [isRecording, setIsRecording] = useState(false); // 녹음 상태를 관리
	const [serverResponse, setServerResponse] = useState(null); // SSE로 받은 서버 응답
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

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
				setRecordedAudio(audioBlob);
				setTimeout(() => {
					console.log('1초 지연.');

					handlePostFeedback(); // 녹음이 끝나면 서버에 전송
				}, 1000);
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

	const handlePostFeedback = async () => {
		if (!recordedAudio) {
			console.error('녹음된 오디오가 없습니다.');
			return;
		}

		// FormData 객체 생성
		const formData = new FormData();
		formData.append('audio_file', recordedAudio);

		try {
			// 스트림을 처리하기 위해 postWithReadableStream 함수 호출
			const result = await postWithReadableStream(`/feedback/${userId}/${sentenceId}`, formData, true);
			console.log('스트림 처리 결과:', result);
			// 추가로 스트림 결과에 따른 로직이 필요하다면 여기서 처리
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
