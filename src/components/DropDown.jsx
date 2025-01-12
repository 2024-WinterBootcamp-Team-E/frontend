import styled, { keyframes } from 'styled-components';
import Button from './Button';
import Input from './Input';
import { Edit } from '@styled-icons/boxicons-solid';
import { SignOut } from '@styled-icons/octicons';
import { pretendard_medium, TextSizeL, TextSizeS } from '@/GlobalStyle';
import { pretendard_regular } from '../GlobalStyle';
import { useState } from 'react';

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
	return (
		<StyledDropDownMenu isEditOpen={isEditOpen} isDropDownOpen={isDropDownOpen}>
			<StyledProfileItem>
				<StyledProfileImage src='UserImage.png' alt='Profile' />
				<StyledProfileInfo>
					<StyledNameWrapper>
						<StyledName>TaciTa</StyledName>
						<Button padding='none' onClick={() => setIsEditOpen(!isEditOpen)}>
							<EditIcon size='20' title='Edit' />
						</Button>
					</StyledNameWrapper>
					<StyledEmail>TaciTa@gmail.com</StyledEmail>
				</StyledProfileInfo>
			</StyledProfileItem>
			<StyledEditItem isEditOpen={isEditOpen}>
				<Input isLabel={false} state='default' placeholder='4~12 Num&Letter' />
				<Button varient='white' rounded='full' padding='xs'>
					<Edit size='20' title='Edit' />
				</Button>
			</StyledEditItem>
			<StyledSignOutItem>
				<Button size='full' rounded='xl' padding='md'>
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
