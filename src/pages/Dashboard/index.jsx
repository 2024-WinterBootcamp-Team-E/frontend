import styled from 'styled-components';
import Layout from '@/components/Layout';
import { pretendard_bold } from '@/GlobalStyle';
import React, { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore'; // Zustand 스토어 임포트  
import { get } from '@/api';
import { useNavigate } from 'react-router-dom';
import AverageScoreGraph from '@/components/AverageScoreGraph';

const DashboardPage = () => {
	const { isLoggedIn, profile, setAuth } = useAuthStore(); // 인증 상태와 사용자 프로필
	const [userData, setUserData] = useState({ nickname: '', email: '', user_image: '' });
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const storedUserId = sessionStorage.getItem('userId');
				if (!storedUserId) {
					navigate('/signin');
					return; // 로그인되지 않은 상태
				}

				const result = await get(`/user/${storedUserId}`); // 사용자 프로필 요청
				if (result.code === 200 && result.data) {
					const { nickname, email, user_image } = result.data;

					// Zustand 스토어 업데이트
					setAuth(true, {
						name: nickname,
						email,
						image: user_image,
					});

					// 컴포넌트 내부 상태 업데이트
					setUserData({
						nickname,
						email,
						user_image,
					});
				} else {
					console.error('사용자 정보를 가져오는 데 실패했습니다:', result.message);
				}
			} catch (error) {
				console.error('사용자 정보를 가져오는 중 오류 발생:', error);
			}
		};
	}, [isLoggedIn, navigate, setAuth]);

	return (
		<Layout>
			<PageContainer>
				<CardGrid>
					{' '}
					{/* CardGrid로 수정 */}
					<Card>
						<ProfileImage src={userData.user_image || '/default-profile.png'} alt='Profile' />
						<Nickname>{userData.nickname || 'Guest'}</Nickname>
						<p>{userData.email || 'guest@example.com'}</p>
					</Card>
					<FeedbackCard>
						<CardTitle>My Feedbacks</CardTitle>
						<ContentBox bgColor='#f28b82' /> {/* 색깔 박스 */}
					</FeedbackCard>
					<HistoryCard>
						<CardTitle>My History</CardTitle>
						<AverageScoreGraph />
					</HistoryCard>
				</CardGrid>
			</PageContainer>
		</Layout>
	);
};

export default DashboardPage;

const PageContainer = styled.div`
	/* 상단 여백 계산 */
	padding: 1rem;
	${pretendard_bold}/* 글로벌 스타일 존재 확인 */;
	align-items: center;
	display: flex;
	flex-direction: column;
	height: calc(100vh - 5rem);
	margin: 0;
	width: 100%;
`;

const CardGrid = styled.div`
	/* 2개의 행, 높이는 자동 */
	grid-template-areas:
		'card1 card2'
		'card3 card3';
	/* 아래 열을 병합 */
	width: 100%;
	/* 첫 번째 열은 1배 크기, 두 번째 열은 2배 크기 */
	grid-template-rows: repeat(2, 1fr);
	/* 카드 간 간격 */
	/* 화면 너비 꽉 채우기 */
	height: 100%;
	/* 화면 높이 꽉 채우기 */
	gap: 2rem;
	display: grid;
	grid-template-columns: 1fr 3fr;
`;

const Card = styled.div`
	/* 모서리 둥글게 */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	/* 배경색 */
	padding: 1rem;
	/* 카드 그림자 */
	background-color: #f8f9fa;
	/* 특정 카드의 영역을 지정 */
	&:nth-child(1) {
		grid-area: card1;
	}
	align-items: center;
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	overflow: hidden;
	position: relative;
`;

const FeedbackCard = styled(Card)`
	display: flex;
	flex-direction: column;
	grid-area: card2;
	align-items: flex-start; /* 텍스트 왼쪽 정렬 */
`;

const HistoryCard = styled(Card)`
	grid-area: card3;
	align-items: flex-start;
	padding: 1rem;
`;

const CardTitle = styled.h2`
	/* 아래 여백 추가 */
	font-size: 1.5rem;
	/* 왼쪽 정렬 */
	width: 100%;
	font-weight: bold;
	text-align: left;
`;

const ContentBox = styled.div`
	background-color: ${(props) => props.bgColor || '#ffffff'};
	border-radius: 0.5rem;
	height: calc(100% - 4rem);
	width: 100%;
`;

const ProfileImage = styled.img`
	/* 닉네임과의 간격 */
	/* 동그라미 모양 */
	object-fit: cover;
	/* 이미지를 박스에 맞게 조정 */
	margin-bottom: 1rem;
	/* 프로필 사진의 크기 */
	height: 200px;
	border-radius: 50%;
	width: 200px;
`;

const Nickname = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
`;

const Overlay = styled.div`
	/* 오버레이 둥글게 */
	/* 텍스트 크기 */
	font-weight: bold;
	align-items: center;
	border-radius: 1rem;
	color: white;
	display: flex;
	font-size: 3rem;
	height: 100%;
	justify-content: center;
	left: 0;
	position: absolute;
	text-align: center;
	top: 0;
	width: 100%;
`;

const CategoryName = styled.div`
  z-index: 1;
`;