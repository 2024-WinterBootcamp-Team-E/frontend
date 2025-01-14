import React, { useState } from 'react';
import styled from 'styled-components';
import { Microphone } from '@styled-icons/fa-solid/Microphone';
import { Stop } from '@styled-icons/fa-solid/Stop';

const RecordButton = () => {
    const [isRecording, setIsRecording] = useState(false);

    const handleClick = () => {
        setIsRecording((prev) => !prev); // 상태 토글
        if (isRecording) {
            console.log('녹음 중지!');
            // 녹음 중지 로직 추가
        } else {
            console.log('녹음 시작!');
            // 녹음 시작 로직 추가
        }
    };

    return (
        <StyledButton onClick={handleClick} isRecording={isRecording}>
            {isRecording ? <StopIcon /> : <MicrophoneIcon />}
        </StyledButton>
    );
};

const StyledButton = styled.button`
    background: ${(props) => (props.isRecording ? '#FF3B30' : '#34C759')}; /* 녹음 중이면 빨간색, 대기 상태면 초록색 */
    color: white;
    border: none;
    border-radius: 50%; /* 원형 버튼 */
    width: 3.125rem; /* 50px → 3.125rem */
    height: 3.125rem; /* 50px → 3.125rem */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 1.125rem; /* 18px → 1.125rem */
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: scale(1.05); /* 살짝 확대 */
    }

    &:active {
        transform: scale(0.95); /* 눌렀을 때 축소 */
    }
`;

const MicrophoneIcon = styled(Microphone)`
    color: white;
    width: 1.25rem;
    height: 1.25rem;
`;

const StopIcon = styled(Stop)`
    color: white;
    width: 1.25rem;
    height: 1.25rem;
`;

export default RecordButton;
