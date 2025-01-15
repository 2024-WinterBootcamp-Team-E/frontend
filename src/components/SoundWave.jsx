import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';

const AudioSample = '/SampleAudio.wav';

const SoundWave = () => {
	const containerRef = useRef(null);
	const waveSurferRef = useRef(null);

	useEffect(() => {
		if (containerRef.current) {
			waveSurferRef.current = WaveSurfer.create({
				container: containerRef.current,
				waveColor: '#11317d',
				progressColor: '#b1c5f6',
				cursorColor: '#3267e3',
				height: 100,
				responsive: true,
				url: AudioSample,

				// Set a bar width
				barWidth: 4,
				// Optionally, specify the spacing between bars
				barGap: 2,
				// And the bar radius
				barRadius: 4,
			});

			// Clean up on component unmount
			return () => {
				if (waveSurferRef.current) {
					waveSurferRef.current.destroy();
				}
			};
		}
	}, []);

	return (
		<Container>
			<WaveContainer ref={containerRef} />
		</Container>
	);
};

export default SoundWave;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	max-width: 40rem;
	min-width: 30rem;
`;

const WaveContainer = styled.div`
	width: 100%;
	max-width: 40rem;
	height: 100%;
	margin: 20px 0;
	background-color: #ffffff;
`;
