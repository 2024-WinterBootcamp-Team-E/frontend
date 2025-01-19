import styled, { keyframes } from 'styled-components';
import Button from './Button';
import Input from './Input';
import { Edit } from '@styled-icons/boxicons-solid';
import { SignOut } from '@styled-icons/octicons';
import { pretendard_medium, TextSizeL, TextSizeS } from '@/GlobalStyle';
import { pretendard_regular } from '../GlobalStyle';
import { useState } from 'react';
import useAuthStore from '@/store/authStore'; // Zustand 스토어 임포트
import { useNavigate } from 'react-router-dom';
import { patch } from '@/api';
const EditIcon = styled(Edit)`
	color: gray;

	&:hover {
		color: var(--neutral-100, #0a0a0a);
	}
`;

const SignOutIcon = styled(SignOut)`
	color: var(--neutral-100, #0a0a0a);
`;

const DropDown = ({ isDropDownOpen }) => {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [newNickname, setNewNickname] = useState('');
	const { profile, setAuth, logout } = useAuthStore(); // logout 액션 추가
	const navigate = useNavigate(); // useNavigate 훅 사용

	const updateNickname = async () => {
		try {
			const userId = sessionStorage.getItem('userId'); // 또는 'user_id' 키 사용
			if (!userId) {
				console.error('사용자 ID를 찾을 수 없습니다.');
				return;
			}

			// 공통 patch 함수를 사용하여 PATCH 요청 전송
			const result = await patch(`/user/${userId}`, { nickname: newNickname });

			// 응답 코드가 200이면 상태 업데이트
			if (result.code === 200) {
				// data가 null이어도 newNickname을 사용해 업데이트
				setAuth(true, { ...profile, name: newNickname });

				// 수정 모드를 닫고 입력값 초기화
				setIsEditOpen(false);
				setNewNickname('');
			} else {
				console.error('닉네임 업데이트 실패:', result.message);
			}
		} catch (error) {
			console.error('닉네임 업데이트 중 오류 발생:', error);
		}
	};

	// 로그아웃 핸들러 추가
	const handleSignOut = () => {
		// 세션 스토리지에서 user_id 제거
		sessionStorage.removeItem('userId');
		// Zustand 스토어 상태 초기화
		logout();
		// 필요 시 다른 페이지로 이동 (예: 로그인 페이지)
		navigate('/');
		alert('로그아웃 되었습니다.');
	};

	return (
		<StyledDropDownMenu isEditOpen={isEditOpen} isDropDownOpen={isDropDownOpen}>
			<StyledProfileItem>
				<StyledProfileImage src={profile?.image || '/UserImage.png'} alt='Profile' />
				<StyledProfileInfo>
					<StyledNameWrapper>
						<StyledName>{profile?.name || '닉네임'}</StyledName>
						<Button padding='none' onClick={() => setIsEditOpen(!isEditOpen)}>
							<EditIcon size='20' title='Edit' />
						</Button>
					</StyledNameWrapper>
					<StyledEmail>{profile?.email || '이메일'}</StyledEmail>
				</StyledProfileInfo>
			</StyledProfileItem>

			{/* 닉네임 수정 입력창 */}
			{isEditOpen && (
				<StyledEditItem isEditOpen={isEditOpen}>
					<Input
						isLabel={false}
						state='default'
						placeholder='4~12 Num&Letter'
						value={newNickname}
						onChange={(e) => setNewNickname(e.target.value)}
					/>
					<Button variant='white' rounded='full' padding='xs' onClick={updateNickname}>
						<Edit size='20' title='Edit' />
					</Button>
				</StyledEditItem>
			)}

			<StyledSignOutItem>
				<Button
					size='full'
					rounded='xl'
					padding='md'
					onClick={handleSignOut} // Sign Out 버튼에 클릭 핸들러 연결
				>
					<StyledSignOutTextWrapper>
						<SignOutIcon size='24' title='SignOut' />
						<StyledSignOutText>Sign Out</StyledSignOutText>
					</StyledSignOutTextWrapper>
				</Button>
			</StyledSignOutItem>
		</StyledDropDownMenu>
	);
};

export default DropDown;

const DropBoxWrapperSlideDown = keyframes`
	from {
		height: 8.5rem;
	}
	to {
		height: 12.75rem;
	}
`;

const DropBoxWrapperSlideUp = keyframes`
	from {
		height: 12.75rem;
	}
	to {
		height: 8.5rem;
	}
`;

const StyledDropDownMenu = styled.ul`
	background-color: var(--neutral-10, #ffffff);
	border-radius: var(--rounded-xl, 2rem);
	display: ${({ isDropDownOpen }) => (isDropDownOpen ? 'flex' : 'none')};
	flex-direction: column;
	margin: 0;
	padding: 0;
	position: relative;
	width: 15rem;
	overflow: hidden; // 애니메이션 중 내용이 넘치지 않도록 처리

	// height는 애니메이션으로 처리
	animation: ${({ isEditOpen }) => (isEditOpen ? DropBoxWrapperSlideDown : DropBoxWrapperSlideUp)} 0.3s ease-out
		forwards;

	// transition은 애니메이션 외의 속성 변화에 사용
	transition: background-color 0.3s ease;
`;

const StyledProfileItem = styled.li`
	align-items: center;
	background-color: var(--neutral-10, #ffffff);
	border-radius: var(--rounded-xl, 2rem);
	display: flex;
	flex-direction: row;
	gap: 0.75rem;
	height: fit-content;
	justify-content: center;
	list-style: none;
	margin: 0;
	padding: 1rem;
	position: relative;
	z-index: 20;
`;

const StyledProfileImage = styled.img`
	border-radius: var(--rounded-full, 100rem);
	height: 3rem;
	object-fit: cover;
	width: 3rem;
`;

const StyledProfileInfo = styled.div`
	align-items: start;
	display: flex;
	flex-direction: column;
	height: fit-content;
	justify-content: center;
	width: 100%;
`;

const StyledNameWrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: row;
	gap: 0.25rem;
	height: fit-content;
	justify-content: start;
	width: 100%;
`;

const StyledName = styled.p`
	${TextSizeL}
	${pretendard_medium}

	height: fit-content;
	margin: 0;
`;

const StyledEmail = styled.p`
	${TextSizeS}
	${pretendard_medium}

	color: var(--neutral-70, #717375);
	height: fit-content;
	margin: 0;
`;

const EditMenuSlideDown = keyframes`
	from {
		transform: translateY(-50%);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
`;

const EditMenuSlideUp = keyframes`
	from {
		transform: translateY(0);
		opacity: 1;
	}
	to {
		transform: translateY(-50%);
		opacity: 0;
	}
`;

const StyledEditItem = styled.li`
	background-color: var(--neutral-10, #ffffff);
	border-radius: 0 0 2rem 2rem;
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
	height: fit-content;
	list-style: none;
	margin: 0;
	padding: 1rem;
	width: 100%;
	z-index: 10;

	visibility: ${({ isEditOpen }) => (isEditOpen ? 'visible' : 'hidden')};
	opacity: ${({ isEditOpen }) => (isEditOpen ? 1 : 0)};
	animation: ${({ isEditOpen }) => (isEditOpen ? EditMenuSlideDown : EditMenuSlideUp)} 0.3s ease-out;
	transition: visibility 0.3s;
`;

const StyledSignOutItem = styled.li`
	background-color: var(--neutral-10, #ffffff);
	border-radius: var(--rounded-xl, 2rem);
	height: fit-content;
	list-style: none;
	margin: 0;
	position: absolute;
	bottom: 0;
	width: 15rem;
`;

const StyledSignOutTextWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 0.75rem;
`;

const StyledSignOutText = styled.p`
	${TextSizeL}
	${pretendard_regular}
`;
