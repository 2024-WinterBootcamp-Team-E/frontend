// DashboardPage.jsx
import styled from 'styled-components';
import { Edit } from '@styled-icons/boxicons-solid';
import Layout from '@/components/Layout';
import { pretendard_bold } from '@/GlobalStyle';
import useAuthStore from '@/store/authStore';
import Attendance from '@/components/Attendance';
import DashboardGraphs from '@/components/DashboardGraphs';
import Button from '@/components/Button';
import { post } from '@/api';

const DashboardPage = () => {
	const { profile, setAuth } = useAuthStore();
	const userId = sessionStorage.getItem('userId');

	const postUserImage = async () => {
		try {
			const fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.accept = 'image/*';
			fileInput.onchange = async (event) => {
				const file = event.target.files[0];
				if (!file) return;

				const formData = new FormData();
				formData.append('file', file);
				try {
					const response = await post(`/user/${userId}/image`, formData, true);
					console.log('서버 응답:', response);
					setAuth(true, {
						image: response.data,
						name: profile.name,
						email: profile.email,
					});
				} catch (error) {
					console.error('이미지 업로드 오류:', error);
				}
			};
			fileInput.click();
		} catch (error) {
			console.error('postUserImage Error:', error);
		}
	};

	return (
		<Layout>
			<PageContainer>
				<CardGrid>
					<Card>
						<Button padding='none' rounded='full' onClick={postUserImage}>
							<ProfileImageWrapper>
								<ProfileImage src={profile?.image || '/EAStudy.png'} alt='Profile' />
								<EditIcon />
							</ProfileImageWrapper>
						</Button>
						<div>
							<Nickname>{profile?.name}</Nickname>
							<p>{profile?.email || 'guest@example.com'}</p>
						</div>
					</Card>
					<HistoryCard>
						<CardTitle>My Attendance</CardTitle>
						<Attendance />
					</HistoryCard>
					<FeedbackCard>
						<CardTitle>My Histories</CardTitle>
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
	${pretendard_bold};
	align-items: center;
	display: flex;
	flex-direction: column;
	height: calc(100vh - 5rem);
	margin: 0;
	padding: 1rem;
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
	&:nth-child(1) {
		grid-area: card1;
	}
	align-items: center;
	background-color: var(--neutral-10);
	border-radius: 1rem;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	gap: 1rem;
	justify-content: center;
	overflow: hidden;
	padding: 1rem;
	position: relative;
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
	text-align: start;
	width: 100%;
`;

const ProfileImage = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
	object-position: center;
	background-color: var(--neutral-20);
	box-shadow: 0 0 1rem var(--neutral-20);
	transition: filter 0.3s ease; /* 어두워지는 전환 효과 */
`;

const EditIcon = styled(Edit)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 3rem;
	height: 3rem;
	color: var(--neutral-10, #ffffff);
	background-color: transparent;
	border-radius: 50%;
	padding: 0.5rem;
	opacity: 0;
	visibility: hidden;
	transition:
		opacity 0.3s ease,
		visibility 0.3s ease; /* 아이콘 전환 효과 */
	cursor: pointer;
`;

const ProfileImageWrapper = styled.div`
	position: relative;
	width: 13rem;
	height: 13rem;

	&:hover {
		${ProfileImage} {
			filter: brightness(0.8); /* 이미지 어둡게 */
		}

		${EditIcon} {
			opacity: 1; /* 아이콘 표시 */
			visibility: visible;
		}
	}
`;

const Nickname = styled.h3`
	font-size: 1.5rem;
	font-weight: bold;
	margin: 0;
`;
