import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { AngleLeft } from '@styled-icons/fa-solid';
import { ToggleOff, ToggleOn } from '@styled-icons/fa-solid';
import ChatBubble from '@/components/ChatBubble';
import Layout from '@/components/Layout';
import RecordButton from '@/components/RecordButton';
import Button from '@/components/Button';
import chatData from '@/mock/chatData';
import { get, post } from '@/api/index';
import { useChatroomStore, useChatroomDataStore } from '@/store'

const IStudy = () => {
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // 사이드바 상태
	const [selectedChat, setSelectedChat] = useState(null); // 초기 상태 추가
	const [isModalOpen, setIsModalOpen] = useState(false); // Modal 상태
	const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지
	const [inputValue, setInputValue] = useState(''); // 입력 값
	// const messages = chatData.messages;
	const [messages, setMessages] = useState([]);
	const chatContentRef = useRef(null); // 채팅창 참조
	const [feedbackVisibility, setFeedbackVisibility] = useState({});
	const { chatroomList, setChatroomList } = useChatroomStore();
	const { openedChatroomList, currentChatroom, setOpenedChatroomList, findChatroomById, setCurrentChatroom } =
		useChatroomDataStore();
	const userId = sessionStorage.getItem('userId'); // 유저id 가져오는 함수

	const toggleSidebar = () => {
		setIsSidebarExpanded(!isSidebarExpanded);
	};

	const toggleFeedback = (index) => {
		setFeedbackVisibility((prevState) => ({
			...prevState,
			[index]: !prevState[index], // 특정 메시지의 피드백 토글
		}));
	};

	// 특정 채팅방 상세 정보 및 메시지 가져오기
	const handleGetChatDetails = async (chatId) => {
		try {
			const response = await get(`/chat/${userId}/${chatId}`);
			console.log(response);
			setSelectedChat({
				chatroomId: response.data.chat_info.chat_id,
				title: response.data.chat_info.title,
				create_at: response.data.chat_info.created_at,
				updated_at: response.data.chat_info.updated_at,
			});
			setCurrentChatroom(response.data.chat_info);
			setMessages(response.data.chat_history); // 메시지 히스토리 업데이트
		} catch (error) {
			console.error(`${chatId}번 채팅방 조회 실패:`, error.message);
			alert('채팅방 정보를 가져오는 데 실패했습니다.');
		}
	};

	// 전체 채팅방 목록 조회
	const handleGetChatRoom = async () => {
		try {
			const response = await get(`/chat/${userId}`);
			console.log(response.code, response.message);
			setChatroomList(response.data);
		} catch (error) {
			console.error('전체 채팅방 조회 실패', error.message);
			alert('전체 채팅방 조회 실패');
		}
	};

	// 채팅방 생성
	const handlePostChatroom = async () => {
		if (!inputValue || !selectedImage) {
			alert('채팅방 제목과 캐릭터를 선택하세요!');
			return;
		}
		try {
			const requestBody = {
				character_name: selectedImage,
				title: inputValue,
			};
			console.log('Request Body:', requestBody); // 요청 데이터 확인
			const response = await post(`/chat/${userId}/chat`, requestBody);
			 
			// 새 채팅방 목록에 추가
			setChatroomList(response.data);

			alert('채팅방이 성공적으로 생성되었습니다!');
			setIsModalOpen(false); // 모달 닫기
		} catch (error) {
			if (error.response) {
				console.error('Server Error Message:', error.response.data); // 서버 에러 메시지 출력
				alert(`오류: ${error.response.data.detail || '알 수 없는 오류가 발생했습니다.'}`);
			} else {
				console.error('Unexpected Error:', error);
				alert('채팅방 생성 중 알 수 없는 오류가 발생했습니다.');
			}
		}
	};

	const formatDate = (isoString) => {
		const date = new Date(isoString);
		const year = String(date.getFullYear()).slice(-2); // 연도 마지막 두 자리
		const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}/${month}/${day}`;
	};

	// 첫 렌더링 시 전체 채팅방 목록 조회 및 설정
	useEffect(() => {
		const onFirstEnter = () => {
			if (!selectedChat && chatroomList.length > 0) {
				setCurrentChatroom(chatroomList[0]);
				console.log(chatroomList[0]);
			}
		};
		const fetchChatRooms = async () => {
			await handleGetChatRoom(); // 채팅방 목록을 먼저 가져옴
			onFirstEnter(); // 이후에 첫 번째 채팅방 선택
		};

		fetchChatRooms();
	}, [userId]);

	// 현재 채팅방 메세지 자동 스크롤 기능
	useEffect(() => {
		// 새로운 메시지가 추가될 때마다 스크롤이 아래로 이동
		chatContentRef.current?.scrollTo({
			top: chatContentRef.current.scrollHeight,
			behavior: 'smooth',
		});
	}, [messages, selectedChat]);

	const findChatroom = (chatId) => {
		const response = findChatroomById(chatId);
		console.log(response);
	};

	return (
		<Layout>
			<MainContainer expanded={isSidebarExpanded}>
				{/* 왼쪽 사이드바 */}
				<Sidebar expanded={isSidebarExpanded}>
					{isSidebarExpanded ? (
						<>
							<SidebarHeader>
								<h5>Chat List</h5>
								<ToggleWrapper onClick={toggleSidebar}>
									<StyledToggleOff />
								</ToggleWrapper>
							</SidebarHeader>
							<StyledHr />
							<Button varient='plus' rounded='sm' padding='none' size='wide' onClick={() => setIsModalOpen(true)}>
								+
							</Button>
							<SubjectList>
								{chatroomList.map((chatroom, index) => (
									<SubjectItem
										key={index}
										onClick={() => {
											handleGetChatDetails(chatroom.chat_id); // 선택된 채팅방 조회
										}}
									>
										<span role='img' aria-label='flag'>
											{chatroom.character_name == '영국' ? 'UK' : 'USA'}
										</span>
										<TitleText>{chatroom.title}</TitleText>
										<DateDisplay>{formatDate(chatroom.updated_at)}</DateDisplay>
									</SubjectItem>
								))}
							</SubjectList>
						</>
					) : (
						<ToggleWrapper onClick={toggleSidebar}>
							<StyledToggleOn />
						</ToggleWrapper>
					)}
				</Sidebar>

				{/* 채팅 영역 */}
				<ChatSection>
					<ChatHeader>
						<AngleLeftIcon />
						<ChatTitle>
							<TitleLarge>{currentChatroom?.title || 'Subject1'}</TitleLarge>
							<TitleSmall>
								{currentChatroom
									? `${formatDate(currentChatroom.created_at)} ~ ${formatDate(currentChatroom.updated_at)}`
									: 'yyyy.mm.dd ~ yyyy.mm.dd'}
							</TitleSmall>
						</ChatTitle>
					</ChatHeader>
					<StyledHr />
					<ChatContent ref={chatContentRef}>
						{messages.map((message, index) => (
							<ChatBubble
								key={index}
								message={message}
								isFeedbackVisible={feedbackVisibility[index] || false}
								toggleFeedback={() => toggleFeedback(index)}
							/>
						))}
					</ChatContent>
					<RecordSection>
						<RecordButton where='istudy' />
					</RecordSection>
				</ChatSection>
			</MainContainer>
			{/* Modal */}
			<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={modalStyles} ariaHideApp={false}>
				<ModalContent>
					{/* 오른쪽 위 X 버튼 */}
					<CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>

					<h2>Create New Chat</h2>
					<ImageSelector>
						<Button padding='none' rounded='full' onClick={() => setSelectedImage('미국')}>
							<img src='/public/usa.png' alt='USA' className={selectedImage === '미국' ? 'selected' : ''} />
						</Button>
						<Button padding='none' rounded='full' onClick={() => setSelectedImage('영국')}>
							<img src='/public/uk.png' alt='UK' className={selectedImage === '영국' ? 'selected' : ''} />
						</Button>
					</ImageSelector>
					<InputBox placeholder='Enter your topic' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
					<ButtonWrapper>
						<Button
							varient='white'
							rounded='sm'
							border='black'
							onClick={handlePostChatroom} // 채팅방 생성 함수 호출
						>
							Create
						</Button>
						<Button varient='black' border='black' rounded='sm' onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
					</ButtonWrapper>
				</ModalContent>
			</Modal>
		</Layout>
	);
};

// Styled Components
const MainContainer = styled.div`
	display: grid;
	grid-template-columns: ${(props) => (props.expanded ? '20% 80%' : '5% 95%')};
	grid-gap: 1rem;
	background-color: var(--neutral-10);
	transition: grid-template-columns 0.3s ease;
	height: 100%;
`;

const Sidebar = styled.aside`
	background-color: #d4d5c8;
	padding: ${(props) => (props.expanded ? '1rem' : '0.5rem')};
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	overflow: auto;
	height: 100%;
	max-height: 82vh;
	transition:
		width 0.3s ease,
		padding 0.3s ease;
	position: relative;
`;

const SidebarHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 4rem;
	margin: 0;
	padding: 0;

	h5 {
		padding-left: 0.5rem;
	}
`;

const ToggleWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	width: 2.5rem;
	height: 2.5rem;
`;

const StyledToggleOn = styled(ToggleOn)`
	color: var(--neutral-100);
	width: 2rem;
	height: 2rem;
	margin-top: 2.4rem;
	margin-left: 0.5rem;
`;

const StyledToggleOff = styled(ToggleOff)`
	color: var(--neutral-100);
	width: 2rem;
	height: 2rem;
`;

const StyledHr = styled.hr`
	margin: 0;
	padding: 0;
	margin-bottom: 0.5rem;
`;

const SubjectList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	padding-top: 0.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	height: 100%;
	overflow-y:auto;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		display:none;
	}
`;

const SubjectItem = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
	background-color: var(--neutral-10);
	border-radius: 0.5rem;
	cursor: pointer;
	gap: 1rem;

	span {
		width: 1.5rem;
		text-align:start;
	}
`;

const TitleText = styled.p`
	flex-grow: 1;
	font-size: 1rem;
	color: #333; /* 기본 텍스트 색상 */
	overflow: hidden; /* 내용이 길어질 경우 숨김 처리 */
	text-overflow: ellipsis; /* 생략 기호 추가 */
	white-space: nowrap; /* 한 줄로 표시 */
	text-align:start;
`;

const DateDisplay = styled.p`
	font-size: 0.875rem;
	color: #6c757d;
	text-align:end;
`;

const ChatSection = styled.section`
	display: flex;
	flex-direction: column;
	background-color: #e0e0d5;
	padding: 1rem;
	border-radius: 1rem;
	overflow: auto;
	width: 100%;
	height: 100%;
`;

const ChatHeader = styled.header`
	display: flex;
	align-items: center;
	gap: 0.5rem; /* 아이콘과 제목 사이 간격 추가 */
	padding-bottom: 1rem;
	border-bottom: 1px solid var(--neutral-30);
	height: 4rem;
`;

const DateRange = styled.span`
	font-size: 0.875rem;
	color: var(--neutral-70);
`;

const AngleLeftIcon = styled(AngleLeft)`
	color: var(--neutral-100);
	width: 1.25rem;
	height: 1.25rem;
`;

const ChatTitle = styled.h4`
	margin: 0;
	font-size: 1.25rem; /* 적절한 크기로 설정 */
	color: var(--neutral-100); /* 텍스트 색상 */
	display: flex;
	white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 설정 */
	overflow: hidden; /* 텍스트가 길면 숨김 처리 */
	gap: 0.5rem;
`;

const TitleLarge = styled.span`
	font-size: 1.5rem;
	font-weight: bold;
	color: var(--neutral-100);
`;

const TitleSmall = styled.span`
	font-size: 0.875rem;
	color: var(--neutral-70);
`;

const ChatContent = styled.div`
	flex: 1;
	overflow-y: auto;
	margin-top: 1rem;
`;

const RecordSection = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 1rem;
`;

// Modal 스타일 설정
const modalStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		padding: '2rem',
		borderRadius: '1rem',
		maxWidth: '400px',
		width: '100%',
	},
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
};
const ModalContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	h2 {
		margin: 0;
		text-align: center;
	}
`;

const ImageSelector = styled.div`
	display: flex;
	justify-content: space-around;

	img {
		width: 80px;
		height: 80px;
		cursor: pointer;
		border-radius: 50%;
		border: 2px solid transparent;

		&.selected {
			border-color: var(--neutral-100);
		}
	}
`;

const InputBox = styled.input`
	width: 100%;
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: 1px solid var(--neutral-70);
	font-size: 1rem;
`;

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: end;
	gap: 1rem;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	color: #333;

	&:hover {
		color: #000;
	}
`;

export default IStudy;