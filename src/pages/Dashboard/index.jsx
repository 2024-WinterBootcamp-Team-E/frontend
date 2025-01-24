// DashboardPage.jsx
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { pretendard_bold } from '@/GlobalStyle';
import React, { useState, useEffect, useMemo } from 'react';
import useAuthStore from '@/store/authStore';
import { get } from '@/api';
import { useNavigate } from 'react-router-dom';
import Attendance from '@/components/Attendance';
import DashboardGraphs from '@/components/DashboardGraphs';

const DashboardPage = () => {
	const { isLoggedIn, profile, setAuth } = useAuthStore();
	const [userData, setUserData] = useState({ nickname: '', email: '', user_image: '' });
	const navigate = useNavigate();
	const [contributions, setContributions] = useState({});
	// const storedUserId = sessionStorage.getItem('userId');
	const storedUserId = 19;

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!storedUserId) {
					navigate('/signin');
					return; // 로그인되지 않은 상태
				}
				// 사용자 프로필 요청
				const profileResult = await get(`/user/${storedUserId}`);
				if (profileResult.data) {
					const { nickname, email, user_image } = profileResult.data;
					setUserData({ nickname, email, user_image });
				} else {
					console.error('사용자 정보를 가져오는 데 실패했습니다:', profileResult.message);
				}

				const contributionsResult = await get(`/user/attendance/${storedUserId}`);
				const attendanceStatus = contributionsResult?.attendance_status || [];
				const today = new Date();

				const contributionData = attendanceStatus.reduce((acc, status, index) => {
					const date = new Date(today);
					date.setDate(today.getDate() - index);
					const dateString = date.toISOString().split('T')[0];
					acc[dateString] = status;
					return acc;
				}, {});
				setContributions(contributionData);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, [isLoggedIn, navigate]);

	return (
		<Layout>
			<PageContainer>
				<CardGrid>
					<Card>
						<ProfileImage src={userData.user_image || '/UserImage.png'} alt='Profile' />
						<div>
							<Nickname>{userData.nickname || 'Guest'}</Nickname>
							<p>{userData.email || 'guest@example.com'}</p>
						</div>
					</Card>
					<HistoryCard>
						<CardTitle>My History</CardTitle>

						{/** Attendance 컴포넌트로 출석 달력 표시 */}
						<Attendance contributions={contributions} />
					</HistoryCard>
					<FeedbackCard>
						<CardTitle>My Feedbacks</CardTitle>
						<DashboardGraphs />
					</FeedbackCard>
				</CardGrid>
			</PageContainer>
		</Layout>
	);
};

export default DashboardPage;

// 이하 스타일 정의
const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: calc(100vh - 5rem);
	padding: 1rem;
	margin: 0;
	${pretendard_bold}
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
	position: relative;
	overflow: hidden;
	border-radius: 1rem;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	background-color: var(--neutral-10);
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	&:nth-child(1) {
		grid-area: card1;
	}
`;

const HistoryCard = styled(Card)`
	grid-area: card2;
	justify-content: start;
	align-items: flex-start;
`;

const FeedbackCard = styled(Card)`
	grid-area: card3;
	align-items: flex-start;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: left;
  width: 100%;
  text-align: start;
`;

const ContentBox = styled.div`
  width: 100%;
  height: calc(100% - 4rem);
  background-color: ${(props) => props.bgColor || '#ffffff'};
  border-radius: 0.5rem;
`;

const ProfileImage = styled.img`
  width: 13rem;
  height: 13rem;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--neutral-20);
  box-shadow: 0rem 0rem 1rem var(--neutral-20);
`;

const Nickname = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;
