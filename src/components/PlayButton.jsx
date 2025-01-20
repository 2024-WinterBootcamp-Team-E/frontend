import React, { useState } from 'react';
import styled from 'styled-components';
import { Play, Pause } from '@styled-icons/fa-solid';

const PlayButton = ({ onClick, isPlaying }) => {
	// const [isPlaying, setIsPlaying] = useState(false);

	const handleClick = () => {
		// setIsPlaying((prev) => !prev); // isRecording 상태 토글
		if (onClick) {
			onClick(); // 부모 컴포넌트로 전달된 onClick 호출
		}
	};
	return (
		<StyledButton onClick={handleClick} $isPlaying={isPlaying}>
			{isPlaying ? <PauseIcon size='1.25rem' /> : <PlayIcon size='1.25rem' />}
		</StyledButton>
	);
};

const StyledButton = styled.button`
	&:hover {
		transform: scale(1.05);
	}

	&:active {
		transform: scale(0.95);
	}
	align-items: center;
	background: ${(props) => (props.$isPlaying ? 'var(--info-pressed)' : 'var(--neutral-10)')};
	border: 2px solid;
	border-color: ${(props) => (props.$isPlaying ? 'transparent' : 'var(--info-pressed)')};
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	font-size: 1.125rem;
	height: 3.125rem;
	justify-content: center;
	padding: 1rem;
	transition: transform 0.2s ease-in-out;
	width: 3.125rem;
`;

const PlayIcon = styled(Play)`
	color: var(--info-pressed);
`;

const PauseIcon = styled(Pause)`
	color: var(--neutral-10);
`;

export default PlayButton;
