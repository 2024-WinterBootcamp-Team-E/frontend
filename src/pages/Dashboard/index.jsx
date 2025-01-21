import styled from 'styled-components';
import Layout from '@/components/Layout';
import { pretendard_bold } from '@/GlobalStyle';
import React, { useState, useEffect, useMemo } from 'react';
import useAuthStore from '@/store/authStore'; // Zustand 스토어 임포트
import { get } from '@/api';
import { useNavigate } from 'react-router-dom';
import { I } from 'styled-icons/fa-solid';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_SHORT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const DashboardPage = () => {
	const { isLoggedIn, profile, setAuth } = useAuthStore(); // 인증 상태와 사용자 프로필
	const [userData, setUserData] = useState({ nickname: '', email: '', user_image: '' });
	const navigate = useNavigate();
	const [contributions, setContributions] = useState({});
	const storedUserId = sessionStorage.getItem('userId');

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!storedUserId) {
					navigate('/signin');
					return; // 로그인되지 않은 상태
				}
				const profileResult = await get(`/user/${storedUserId}`); // 사용자 프로필 요청
				if (profileResult.data) {
					const { nickname, email, user_image } = profileResult.data;
					// 컴포넌트 내부 상태 업데이트
					setUserData({
						nickname,
						email,
						user_image,
					});
				} else {
					console.error('사용자 정보를 가져오는 데 실패했습니다:', profileResult.message);
				}
				// 출석 기록 가져오기
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
	}, [isLoggedIn, navigate]);

	// 깃허브 스타일 그리드 + 라벨
	const { gridItems, monthLabels, dayLabels } = useMemo(() => {
		return generateGithubStyleGrid(contributions);
	}, [contributions]);

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
						<AttendanceSection>
							<AttendanceWrapper>
								{/* 실제 칸(격자) */}
								<AttendanceGrid>{gridItems}</AttendanceGrid>
								{monthLabels.map(({ monthName, xOffset, key }) => (
									<MonthLabel key={key} style={{ left: xOffset }}>
										{monthName}
									</MonthLabel>
								))}

								{/* 요일(day) 라벨: 절대 위치 (예: 일,화,목 정도만 표시) */}
								{dayLabels.map(({ dayName, yOffset, key }) => (
									<DayLabel key={key} style={{ top: yOffset }}>
										{dayName}
									</DayLabel>
								))}
							</AttendanceWrapper>
						</AttendanceSection>
					</HistoryCard>
					<FeedbackCard>
						<CardTitle>My Feedbacks</CardTitle>
						<ContentBox bgColor='#d3d3d3' />
					</FeedbackCard>
				</CardGrid>
			</PageContainer>
		</Layout>
	);
};

export default DashboardPage;

const generateGithubStyleGrid = (contributions) => {
	const gridItems = [];
	const monthLabels = [];
	const dayLabels = [];

	const BOX_SIZE = 13;
	const BOX_GAP = 2;

	const today = new Date();
	const startDate = new Date(today);
	startDate.setDate(startDate.getDate() - 364);
	while (startDate.getDay() !== 0) {
		startDate.setDate(startDate.getDate() - 1);
	}

	const totalDays = Math.floor((today - startDate) / (24 * 60 * 60 * 1000)) + 1;
	const usedMonths = new Set();

	for (let i = 0; i < totalDays; i++) {
		const currDate = new Date(startDate);
		currDate.setDate(startDate.getDate() + i);

		const dayOfWeek = currDate.getDay(); // (일=0 ~ 토=6)
		const weekIndex = Math.floor(i / 7); // 왼쪽부터 0,1,2,... 열

		const dateString = currDate.toISOString().split('T')[0];
		const count = contributions[dateString] || 0;

		// xOffset = 왼쪽부터 weekIndex * 칸 크기
		const xOffset = weekIndex * (BOX_SIZE + BOX_GAP);
		// yOffset = 위부터 dayOfWeek * 칸 크기
		const yOffset = dayOfWeek * (BOX_SIZE + BOX_GAP);

		// 해당 달의 첫 번째 날일 경우 라벨 추가
		if (currDate.getDate() === 1 || i === 0) {
			const month = currDate.getMonth(); // 0 ~ 11
			const monthName = MONTHS_SHORT[month];
			// if (!usedMonths.has(month)) {
			// 	usedMonths.add(month);
			// 	monthLabels.push({
			// 		monthName,
			// 		xOffset,
			// 		key: `month-${month}-${i}`,
			// 	});
			// }
			usedMonths.add(month);
			monthLabels.push({
				monthName,
				xOffset,
				key: `month-${month}-${i}`,
			});
		}

		gridItems.push(
			<GridBox
				key={dateString}
				count={count}
				style={{
					transform: `translate(${xOffset}px, ${yOffset}px)`,
				}}
				title={`${dateString} (${count}회)`}
			/>,
		);
	}

	const dayLabelIndices = [1, 3, 5];
	dayLabelIndices.forEach((dayIndex) => {
		const dayName = DAYS_OF_WEEK[dayIndex];
		const yOffset = dayIndex * (BOX_SIZE + BOX_GAP);
		dayLabels.push({
			dayName,
			yOffset,
			key: `day-${dayIndex}`,
		});
	});

	return {
		gridItems,
		monthLabels,
		dayLabels,
	};
};

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: calc(100vh - 5rem); /* 상단 여백 계산 */
	padding: 1rem;
	margin: 0;
	${pretendard_bold}
`;

const CardGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 3fr;
	grid-template-rows: repeat(2, 1fr);
	grid-template-areas:
		'card1 card2'
		'card3 card3';
	width: 100%;
	height: 100%;
	gap: 2rem;
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

const AttendanceSection = styled.div`
	position: relative;
	padding: 1.1rem 0.1rem 0.1rem 2.1rem;
	width: 100%;
	height: 100%;
	/* border: 1px solid black; */
	border-radius: 1rem;
	fill: var(--secondary-focus);
`;

const AttendanceWrapper = styled.div`
	position: relative;
	/* 넉넉하게 width/height 잡거나, 정확히 계산해도 됨 */
	width: calc(53 * 15px); /* 13 + 2 gap = 15 */
	/* height: calc(7 * 14px); */
	height: 100%;
	/* margin-left: 2rem; 라벨과의 간격 등 조정 */
	display: flex;
	align-items: center;
	justify-content: center;
`;

const AttendanceGrid = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
`;

/** 깃허브 스타일 칸 */
const GridBox = styled.div`
	position: absolute;
	width: 12px;
	height: 12px;
	background-color: ${({ count }) => {
		if (count >= 3) return '#0b4a1f';
		if (count === 2) return '#216e39';
		if (count === 1) return '#30a14e';
		return '#ebedf0';
	}};
	border-radius: 2px;
`;

/** 월(month) 라벨 */
const MonthLabel = styled.div`
	position: absolute;
	top: -14px; /* 그리드 위로 표시 */
	font-size: 0.75rem;
	color: #999;
	width: 12px;
	text-align: center;
`;

/** 요일(day) 라벨 */
const DayLabel = styled.div`
	position: absolute;
	left: -30px; /* 박스 왼쪽에 표시 */
	font-size: 0.75rem;
	color: #999;
`;

const HistoryCard = styled(Card)`
	grid-area: card2;
	justify-content: center;
	align-items: center;
	gap: 1rem;
`;

const FeedbackCard = styled(Card)`
	grid-area: card3;
	align-items: flex-start; /* 텍스트 왼쪽 정렬 */
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