import React from 'react';
import styled from 'styled-components';
import { Play, Pause } from '@styled-icons/fa-solid';

const PlayButton = ({ isPlaying, onClick }) => {
	return (
		<StyledButton onClick={onClick} isPlaying={isPlaying}>
			{isPlaying ? <PauseIcon size='1.25rem' /> : <PlayIcon size='1.25rem' />}
		</StyledButton>
	);
};

const StyledButton = styled.button`
	background: ${(props) => (props.isPlaying ? '#FF3B30' : '#34C759')};
	color: white;
	border: none;
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
	color: white;
`;

const PauseIcon = styled(Pause)`
	color: white;
`;

export default PlayButton;
