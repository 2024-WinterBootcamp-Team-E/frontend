import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout'; // Layout 컴포넌트 가져오기
import { display1 } from '@/GlobalStyle'; // GlobalStyle에서 display1 가져오기

const Intonation = () => {
	const navigate = useNavigate();
	// 컴포넌트 이름 수정
	const handleIntonationClick = (type) => {
		navigate(`/intonation/istudy?type=${type}`);
	};
	return (
		<Layout>
			{' '}
			{/* Layout으로 감싸기 */}
			<PageContainer>
				<Main>
					<Card className='left' borderRadius='2rem 0 0 2rem' onClick={() => handleIntonationClick('American')}>
						<ImageWrapper>
							<img src='/SpeechImages/state.jpg' alt='American English' />
						</ImageWrapper>
						<CenteredText>American English</CenteredText>
					</Card>
					<Card className='right' borderRadius='0 2rem 2rem 0' onClick={() => handleIntonationClick('British')}>
						<ImageWrapper>
							<img src='/SpeechImages/big.jpg' alt='British English' />
						</ImageWrapper>
						<CenteredText>British English</CenteredText>
					</Card>
				</Main>
			</PageContainer>
		</Layout>
	);
};

export default Intonation;

// 스타일 정의
const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100vh - 6.5rem); /* 화면 전체 높이 */
`;

const Main = styled.div`
	display: flex; /* 카드 정렬을 위한 플렉스 박스 */
	flex: 1;
	height: 100%; /* 헤더 높이 제외 */
	overflow: hidden;
	border: 2px solid transparent; /* 투명한 테두리 추가 */

	&:hover .left:hover,
	&:hover .right:hover {
		flex-grow: 2; /* 마우스 오버된 카드 확대 */
		transition: flex-grow 0.3s ease; /* 크기 변화 애니메이션 */
	}

	&:hover .left:not(:hover),
	&:hover .right:not(:hover) {
		flex-grow: 0.8; /* 마우스 오버되지 않은 카드 축소 */
		transition: flex-grow 0.3s ease; /* 부드러운 축소 애니메이션 */
	}
`;

const CenteredText = styled(display1)`
	position: absolute;
	top: 50%; /* 중앙 배치 */
	left: 50%;
	transform: translate(-50%, -50%);
	color: var(--neutral-10);
	text-shadow: 0px 0px 15px rgba(0, 0, 0, 0.7); /* 텍스트만 그림자 추가 */
	transition: opacity 0.3s ease; /* 텍스트 숨김/표시 애니메이션 */
	opacity: 1; /* 기본 상태에서 텍스트 보임 */
`;

const Card = styled.button`
	position: relative;
	flex: 1; /* 기본 상태에서 동일 크기 */
	height: 100%;
	overflow: hidden;
	border-radius: ${({ borderRadius }) => borderRadius}; /* 동적 border-radius */
	transition: flex-grow 0.3s ease; /* 크기 변화 애니메이션 */
	border: none;
	padding: 0;
	margin: 0;

	&:hover ${CenteredText} {
		opacity: 1; /* 마우스가 올라간 카드의 텍스트 유지 */
	}

	&:not(:hover) ${CenteredText} {
		opacity: 0; /* 마우스가 올라가지 않은 카드의 텍스트 숨기기 */
	}
`;

const ImageWrapper = styled.div`
	width: 100%;
	height: 100%;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover; /* 이미지를 비율에 맞게 꽉 채움 */
		transition: transform 0.3s ease; /* 부드러운 확대 효과 */
	}
`;
