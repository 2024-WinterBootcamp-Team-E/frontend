import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { pretendard_bold } from '@/GlobalStyle';
import { useNavigate } from 'react-router-dom';

const PronunciationPage = () => {
	const navigate = useNavigate();
	const [activeCard, setActiveCard] = useState(null); // 현재 활성화된 카드 (1~4), 없으면 null

	const categories = [
		{ name: 'Travel', image: '/PronunImages/travel3.jpg' },
		{ name: 'Movie', image: '/PronunImages/movie2.jpg' },
		{ name: 'Business', image: '/PronunImages/business2.jpg' },
		{ name: 'Daily', image: '/PronunImages/practical2.jpg' },
	];

	const handleCategoryClick = (categoryRoute) => {
		navigate(`/pronunciation/pstudy?category=${categoryRoute}`);
	};

	return (
		<Layout>
			<PageContainer>
				<CardGrid activeCard={activeCard}>
					{categories.map((category, index) => (
						<Card
							key={category.name}
							onClick={() => handleCategoryClick(category.name)}
							onMouseEnter={() => setActiveCard(index + 1)}
							onMouseLeave={() => setActiveCard(null)}
							isActive={activeCard === index + 1}
						>
							<ImageWrapper>
								<img src={category.image} alt={category.name} loading='lazy' />
							</ImageWrapper>
							<Overlay isActive={activeCard === index + 1}>
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

// 스타일 정의

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	min-height: 100vh; /* 전체 높이 설정 */
	padding: 2rem;
	margin: 0;
	${pretendard_bold}
`;

const CategoryName = styled.div`
	z-index: 10;
	text-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.7); /* 10px → 0.625rem */
	font-size: 2.8rem;
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
	color: white; /* 텍스트 색상 */
	font-weight: bold;
	text-align: center;
	background: ${({ isActive }) => (isActive ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)')}; /* 배경 투명도 조정 */
	border-radius: 1rem; /* 오버레이도 둥글게 */
	transition: background 0.3s ease;
`;

const CardGrid = styled.div`
	display: grid;
	grid-template-columns: ${({ activeCard }) => {
		switch (activeCard) {
			case 1:
				return '1.8fr 1.2fr';
			case 2:
				return '1.2fr 1.8fr';
			case 3:
				return '1.8fr 1.2fr';
			case 4:
				return '1.2fr 1.8fr';
			default:
				return '2fr 2fr';
		}
	}};
	grid-template-rows: ${({ activeCard }) => {
		switch (activeCard) {
			case 1:
				return '1.8fr 1.2fr';
			case 2:
				return '1.8fr 1.2fr';
			case 3:
				return '1.2fr 1.8fr';
			case 4:
				return '1.2fr 1.8fr';
			default:
				return '2fr 2fr';
		}
	}};
	width: 100%;
	max-width: 75rem; /* 1200px → 75rem */
	height: 40rem; /* 700px → 40rem */
	gap: 0.625rem; /* 10px → 0.625rem */
	justify-items: center;
	align-items: center;
	position: relative;
	transition:
		grid-template-columns 0.3s ease,
		grid-template-rows 0.3s ease,
		height 0.3s ease;

	/* 반응형 디자인 */
	@media (max-width: 64rem) {
		/* 1024px → 64rem */
		grid-template-columns: ${({ activeCard }) => {
			switch (activeCard) {
				case 1:
					return '1.8fr 1.2fr';
				case 2:
					return '1.2fr 1.8fr';
				case 3:
					return '1.8fr 1.2fr';
				case 4:
					return '1.2fr 1.8fr';
				default:
					return '2fr 2fr';
			}
		}};
		grid-template-rows: ${({ activeCard }) => {
			switch (activeCard) {
				case 1:
					return '1.8fr 1.2fr';
				case 2:
					return '1.8fr 1.2fr';
				case 3:
					return '1.2fr 1.8fr';
				case 4:
					return '1.2fr 1.8fr';
				default:
					return '2fr 2fr';
			}
		}};
		height: ${({ activeCard }) => (activeCard ? '40rem' : '35rem')}; /* 높이 조정 */
		gap: 0.5rem; /* 8px → 0.5rem */

		.category-card {
			height: 18.75rem; /* 300px → 18.75rem */
		}
	}

	@media (max-width: 48rem) {
		/* 768px → 48rem */
		grid-template-columns: 1fr; /* 모바일에서는 한 열로 변경 */
		grid-template-rows: repeat(4, 1fr);
		height: auto; /* 높이 자동으로 */
		gap: 0.3125rem; /* 5px → 0.3125rem */

		.category-card {
			width: 100%;
			height: 12.5rem; /* 200px → 12.5rem */
			opacity: 1;
			box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1); /* 4px 6px → 0.25rem 0.375rem */
		}

		.category-card:hover {
			box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1); /* 4px 6px → 0.25rem 0.375rem */
		}
	}
`;

const Card = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 1rem; /* 16px → 1rem */
	box-shadow: ${({ isActive }) =>
		isActive
			? '0 0.5rem 1rem rgba(0, 0, 0, 0.2)'
			: '0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)'}; /* 8px 16px → 0.5rem 1rem, 4px 6px → 0.25rem 0.375rem */
	background-color: #f8f9fa;
	cursor: pointer;
	transition: box-shadow 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ImageWrapper = styled.div`
	width: 100%;
	height: 100%;
	transition: transform 0.3s ease;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover; /* 이미지를 박스에 맞게 조정 */
		border-radius: 1rem; /* 16px → 1rem */
		transition: transform 0.3s ease;
	}
`;
