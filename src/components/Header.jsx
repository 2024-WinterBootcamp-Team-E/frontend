import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from '@styled-icons/boxicons-regular';
import { pretendard_bold, TextSizeXL } from '@/GlobalStyle';
import Button from '@/components/Button';
import DropDown from '@/components/DropDown';
import useAuthStore from '@/store/authStore'; // Zustand 스토어 임포트
import { get } from '@/api';
// Styled Components
const HeaderContainer = styled.header`
	display: flex;
	align-items: center;
	padding: 1rem 2rem;
	background-color: transparent;
	border-bottom: 2px solid transparent;
	width: 100%;
	z-index: 1000;
`;

const LeftSide = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
`;

const Center = styled.nav`
	display: flex;
	gap: 2rem;
	list-style: none;
	justify-content: center;

	h3 {
		cursor: pointer;
		color: var(--neutral-100);
	}
`;

const RightSide = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	position: relative;
`;

const Logo = styled.h1`
	color: var(--neutral-100, #0a0a0a);
	cursor: pointer;
	padding-top: 1rem;
`;

const ProfileContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const ProfileImage = styled.img`
	width: 2.5em;
	height: 2.5rem;
	border-radius: 50%;
	border: 2px solid white;
	object-fit: cover;
	/* object-position: center; */
`;

const ProfileName = styled.span`
	${TextSizeXL}
	${pretendard_bold}
  color: var(--neutral-100);
`;

const DropdownButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
`;

const ChevronIcon = styled(ChevronDown)`
	width: 1.5rem;
	height: 1.5rem;
	color: black;
`;

const StyledDropDownWrapper = styled.div`
	position: absolute;
	top: 100%;
	right: 0;
	margin-top: 0.5rem;
	z-index: 1001;
`;

const Header = () => {
	// Zustand 스토어에서 상태와 액션 가져오기
	const { isLoggedIn, profile, setAuth } = useAuthStore();
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				// sessionStorage에서 저장된 user_id 가져오기
				const storedUserId = sessionStorage.getItem('userId');
				if (!storedUserId) {
					// user_id가 없으면 로그인되지 않은 상태
					return;
				}

				// 공통 get 함수를 사용해 FastAPI에 GET 요청 보내기
				const result = await get(`/user/${storedUserId}`);

				// FastAPI 응답 구조에 맞춰 상태 업데이트
				if (result.code === 200 && result.data) {
					setAuth(true, {
						image: result.data.user_image,
						name: result.data.nickname,
						email: result.data.email,
					});
				} else {
					console.error('프로필 조회 실패:', result.message);
				}
			} catch (error) {
				console.error('프로필 가져오기 중 오류 발생:', error);
			}
		};

		fetchProfile();
	}, [setAuth]);

	return (
		<HeaderContainer>
			<LeftSide>
				<Logo onClick={() => navigate('/')}>
					<img src='/logo2.png' alt='EASTUDY' style={{ width: '13rem', height: '4rem' }} />
				</Logo>
			</LeftSide>

			<Center>
				<Button onClick={() => navigate('/intonation')}>
					<h3>Conversation</h3>
				</Button>
				<Button onClick={() => navigate('/pronunciation')}>
					<h3>Sentences</h3>
				</Button>
				<Button>
					<h3>My Activity</h3>
				</Button>
			</Center>

			<RightSide>
				{isLoggedIn && profile ? (
					<ProfileContainer>
						<ProfileImage src={profile.image} alt='Profile' />
						<ProfileName>{profile.name}</ProfileName>
						<DropdownButton onClick={() => setIsDropDownOpen((prev) => !prev)}>
							<ChevronIcon />
						</DropdownButton>
						{isDropDownOpen && (
							<StyledDropDownWrapper>
								<DropDown isDropDownOpen={isDropDownOpen} />
							</StyledDropDownWrapper>
						)}
					</ProfileContainer>
				) : (
					<Button variant='white' rounded='xl' border='signin' onClick={() => navigate('/signin')}>
						Sign In
					</Button>
				)}
			</RightSide>
		</HeaderContainer>
	);
};

export default Header;
