import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { pretendard_bold } from '@/GlobalStyle';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';

const PronunciationPage = () => {
	const navigate = useNavigate();
	const categories = [
		{ name: 'Travel', image: '/PronunImages/travel3.jpg' },
		{ name: 'Movie', image: '/PronunImages/movie2.jpg' },
		{ name: 'Business', image: '/PronunImages/business2.jpg' },
		{ name: 'Daily', image: '/PronunImages/practical2.jpg' },
	];

	// 클릭 핸들러
	const handleCategoryClick = (categoryRoute) => {
		// 원하는 경로로 이동
		navigate(`/pronunciation/pstudy`, { state: { category: categoryRoute } });
	};
	
	return (
		<Layout>
			<PageContainer>
				<CardGrid>
					{categories.map((category) => (
						<Card key={category.name}
							onClick={() => handleCategoryClick(category.name)} // 클릭 이벤트 추가
						>
							<img src={category.image} alt={category.name} />
							<Overlay>
								<CategoryName>{category.name}</CategoryName>
							</Overlay>
						</Card>
					))}
				</CardGrid>
			</PageContainer>
		</Layout>
	);
};

export default PronunciationPage;

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;
	padding: 0 1rem;
	margin: 0;
	${pretendard_bold}
`;

const CardGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr); /* 2열 레이아웃 */
	grid-template-rows: repeat(2, 1fr); /* 2행 레이아웃 */
	width: 100%; /* 화면 너비 꽉 채우기 */
	height: 100%; /* 화면 높이 꽉 채우기 */
	gap: 1rem; /* 카드 간 간격 제거 */
	border-radius: 2rem; /* 모서리 둥글게 */
`;

const Card = styled.div`
	height: fit-content;
	width: fit-content;
	max-height: 20rem;
	position: relative;
	overflow: hidden;
	border-radius: 2rem; /* 모서리 둥글게 */
	background-color: #f8f9fa; /* 배경색 추가 (로딩 중 대비) */
`;

const StyledImage = styled.img`
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 카드 그림자 추가 */
	width: 100%;
	height: 100%;
	object-fit: cover; /* 이미지를 박스에 맞게 조정 */
	border-radius: 2rem; /* 이미지도 모서리 둥글게 */
`;

const Overlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	&:hover {
		transform: scale(1.05);
	}

	&:active {
		transform: scale(0.95);
	}
	transition: transform 0.2s ease-in-out;

	border-radius: 2rem; /* 오버레이도 둥글게 */
`;

const CategoryName = styled.p`
	color: white; /* 텍스트 색상 */
	font-size: 3rem; /* 텍스트 크기 */
	font-weight: bold; /* global style로 폰트 통일하면 좋을듯 */
	text-align: center;
	z-index: 10;
`;