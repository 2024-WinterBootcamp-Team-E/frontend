import React, { useState } from 'react';
import styled from 'styled-components';
import { Microphone } from '@styled-icons/fa-solid/Microphone';
import { Stop } from '@styled-icons/fa-solid/Stop';

const varients = {
	0: 'var(--info-pressed)',
	1: '#7B7D63', // You can add more colors as needed
};

const RecordButton = ({ onClick, where = 0, disabled }) => {
	const [isRecording, setIsRecording] = useState(false);

	const handleClick = () => {
		setIsRecording((prev) => !prev); // Toggle the isRecording state
		if (onClick) {
			onClick(); // Call the onClick prop passed from the parent
		}
	};

	return (
		<StyledButton $isRecording={isRecording} $where={where} onClick={handleClick} disabled={disabled}>
			{isRecording ? <StopIcon $where={where} /> : <MicrophoneIcon $where={where} />}
		</StyledButton>
	);
};

export default RecordButton;

const StyledButton = styled.button`
	background: ${(props) =>
		props.$isRecording ? varients[props.$where] : 'var(--neutral-10)'}; // Use colors based on $isRecording
	border: 2px solid;
	border-color: ${(props) => (props.$isRecording ? 'transparent' : varients[props.$where])};
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
	&:disabled {
		background: #7b7d6380;
	}
`;

const MicrophoneIcon = styled(Microphone)`
	color: ${(props) => (props.$where == 0? 'var(--info-pressed)':'#7B7D63')};
	width: 1.25rem;
	height: 1.25rem;
`;

const StopIcon = styled(Stop)`
	color: var(--neutral-10);
	width: 1.25rem;
	height: 1.25rem;
`;
