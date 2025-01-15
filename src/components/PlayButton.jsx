import React, { useState } from 'react';
import styled from 'styled-components';
import { Play, Pause } from '@styled-icons/fa-solid';

const PlayButton = () => {
	const [isPlaying, setIsPlaying] = useState(false);

	const handleClick = () => {
		setIsPlaying((prev) => !prev); // 상태 토글
		console.log(isPlaying ? '재생 중지!' : '재생 시작!');
		// 추가적인 재생 로직을 여기서 처리
	};

	return (
		<StyledButton onClick={handleClick} isRecording={isPlaying}>
			{isPlaying ? <PauseIcon size='1.25rem' /> : <PlayIcon size='1.25rem' />}
		</StyledButton>
	);
};

const StyledButton = styled.button`
	background: ${(props) =>
		props.isRecording ? '#FF3B30' : '#34C759'}; /* 재생생 중이면 빨간색, 일시 정지지 상태면 초록색 */
	color: white;
	border: none;
	border-radius: 50%; /* 원형 버튼 */
	width: 3.125rem;
	height: 3.125rem;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 1.125rem;
	transition: transform 0.2s ease-in-out;

	&:hover {
		transform: scale(1.05); /* 살짝 확대 */
	}

	&:active {
		transform: scale(0.95); /* 눌렀을 때 축소 */
	}
`;

const PlayIcon = styled(Play)`
	color: white;
`;

const PauseIcon = styled(Pause)`
	color: white;
`;

export default PlayButton;
