import React, { useState } from 'react';
import styled from 'styled-components';
import { Play, Pause } from '@styled-icons/fa-solid';

const PlayButton = ({ onClick }) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const handleClick = () => {
		setIsPlaying((prev) => !prev); // isRecording 상태 토글
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
	background: ${(props) => (props.$isPlaying ? 'var(--info-pressed)' : 'var(--neutral-10)')};
	border: 2px solid;
	border-color: ${(props) => (props.$isPlaying ? 'transparent' : 'var(--info-pressed)')};
	border-radius: 50%;
	width: 3.125rem;
	height: 3.125rem;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 1.125rem;
	transition: transform 0.2s ease-in-out;
	padding: 1rem;

	&:hover {
		transform: scale(1.05);
	}

	&:active {
		transform: scale(0.95);
	}
`;

const PlayIcon = styled(Play)`
	color: var(--info-pressed);
`;

const PauseIcon = styled(Pause)`
	color: var(--neutral-10);
`;

export default PlayButton;
