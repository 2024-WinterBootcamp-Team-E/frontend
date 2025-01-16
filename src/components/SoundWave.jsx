import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';
import PlayButton from '@/components/PlayButton';
import RecordButton from '@/components/RecordButton';

const AudioSample = '/SampleAudio.wav';

const SoundWave = () => {
	const containerRef = useRef(null);
	const waveSurferRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (containerRef.current) {
			// WaveSurfer 인스턴스 생성
			waveSurferRef.current = WaveSurfer.create({
				container: containerRef.current,
				waveColor: '#11317d',
				progressColor: '#b1c5f6',
				cursorColor: '#3267e3',
				height: 80,
				responsive: true,
				url: AudioSample,

				// 바 스타일 지정
				barWidth: 4,
				barGap: 2,
				barRadius: 4,
			});

			// 정리 작업 (컴포넌트 unmount 시)
			return () => {
				if (waveSurferRef.current) {
					waveSurferRef.current.destroy();
				}
			};
		}
	}, []);

	const handlePlay = () => {
		if (waveSurferRef.current) {
			waveSurferRef.current.playPause();
			setIsPlaying((prev) => !prev); // 상태 토글
		}
	};

	return (
		<Container>
			<PlayButton isPlaying={isPlaying} onClick={handlePlay} />
			<RecordButton aria-label='Record Answer' />
			<WaveContainer ref={containerRef} />
		</Container>
	);
};

export default SoundWave;

const Container = styled.div`
	align-items: center;
	display: flex;
	flex-direction: row;
	gap: 1rem;
	height: 100%;
	justify-content: center;
	max-height: 5rem;
	max-width: 40rem;
	min-width: 30rem;
	width: 100%;
`;

const WaveContainer = styled.div`
	background-color: #ffffff;
	height: 100%;
	margin: 20px 0;
	max-width: 40rem;
	width: 100%;
`;
