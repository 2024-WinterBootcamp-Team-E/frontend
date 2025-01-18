import React, { useState } from 'react';
import styled from 'styled-components';
import { Microphone } from '@styled-icons/fa-solid/Microphone';
import { Stop } from '@styled-icons/fa-solid/Stop';

const RecordButton = ({ onClick }) => {
	const [isRecording, setIsRecording] = useState(false);

	const handleClick = () => {
		setIsRecording((prev) => !prev); // isRecording 상태 토글
		if (onClick) {
			onClick(); // 부모 컴포넌트로 전달된 onClick 호출
		}
	};
	return (
		<StyledButton $isRecording={isRecording} onClick={handleClick}>
			{isRecording ? <StopIcon /> : <MicrophoneIcon />}
		</StyledButton>
	);
};

export default RecordButton;

const StyledButton = styled.button`
	background: ${(props) => (props.$isRecording ? 'var(--info-pressed)' : 'var(--neutral-10)')};
	border: 2px solid;
	border-color: ${(props) => (props.$isRecording ? 'transparent' : 'var(--info-pressed)')};
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

const MicrophoneIcon = styled(Microphone)`
	color: var(--info-pressed);
	width: 1.25rem;
	height: 1.25rem;
`;

const StopIcon = styled(Stop)`
	color: var(--neutral-10);
	width: 1.25rem;
	height: 1.25rem;
`;
