import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';
import PlayButton from '@/components/PlayButton';
import RecordButton from '@/components/RecordButton';
import { useRecordStore } from '@/store'; // zustand 스토어 import

const SoundWave = () => {
	const [isPlaying, setIsPlaying] = useState(false); // 재생 상태를 관리
	const [isRecording, setIsRecording] = useState(false); // 녹음 상태를 관리
	const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스
	const audioChunksRef = useRef([]);
	const containerRef = useRef(null); // WaveSurfer가 렌더링될 DOM 참조
	const waveSurferRef = useRef(null); // WaveSurfer 인스턴스를 저장

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

			mediaRecorder.onstop = () => {
				// 녹음 데이터로 Blob 생성
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

				// zustand 스토어에 저장
				setRecordedAudio(audioBlob);
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

	return (
		<Container>
			<RecordButton onClick={isRecording ? handleStopRecording : handleStartRecording} />
			<PlayButton $isPlaying={isPlaying} onClick={handlePlay} />
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