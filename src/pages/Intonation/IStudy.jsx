import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatBubble from '@/components/ChatBubble';
import Layout from '@/components/Layout';
import RecordButton from '@/components/RecordButton';
import { AngleLeft } from '@styled-icons/fa-solid';
import { ToggleOff, ToggleOn } from '@styled-icons/fa-solid';
import Button from '@/components/Button';
import Modal from 'react-modal';
import { get, post } from '@/api'; // API 헬퍼 임포트

const IStudy = () => {
	// 상태 관리
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
	const [selectedChat, setSelectedChat] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const chatContentRef = useRef(null);
	const [feedbackVisibility, setFeedbackVisibility] = useState({});

	const [chatHistory, setChatHistory] = useState([]);
	const [loadingChats, setLoadingChats] = useState(false);
	const [errorChats, setErrorChats] = useState(null);

	const [messages, setMessages] = useState([]);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [errorMessages, setErrorMessages] = useState(null);

	const user_id = sessionStorage.getItem('userId'); // 실제 사용자 ID로 변경하세요.

	// 사이드바 토글 함수
	const toggleSidebar = () => {
		setIsSidebarExpanded(!isSidebarExpanded);
	};

	// 피드백 토글 함수
	const toggleFeedback = (index) => {
		setFeedbackVisibility((prevState) => ({
			...prevState,
			[index]: !prevState[index],
		}));
	};

	// 채팅방 목록 불러오기
	useEffect(() => {
		const fetchChatHistory = async () => {
			setLoadingChats(true);
			setErrorChats(null);
			try {
				const response = await get(`/chat/${user_id}`);
				if (response.code === 200) {
					// 응답 데이터 정렬: updated_at 내림차순
					const sortedData = response.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
					setChatHistory(sortedData);
					if (sortedData.length > 0 && !selectedChat) {
						setSelectedChat(sortedData[0]);
					}
				} else {
					setErrorChats(response.message || '채팅방을 불러오는 데 실패했습니다.');
				}
			} catch (err) {
				setErrorChats('채팅방을 불러오는 도중 오류가 발생했습니다.');
				console.error('채팅방 불러오기 오류:', err);
			} finally {
				setLoadingChats(false);
			}
		};

		if (user_id) {
			fetchChatHistory();
		}
	}, [user_id, selectedChat]);

	// 선택된 채팅방의 메시지 불러오기
	useEffect(() => {
		const fetchMessages = async () => {
			if (selectedChat) {
				setLoadingMessages(true);
				setErrorMessages(null);
				try {
					const response = await get(`/chat/${user_id}/${selectedChat.chat_id}`);
					if (response.code === 200) {
						setMessages(response.data.chat_history);
					} else {
						setErrorMessages(response.message || '메시지를 불러오는 데 실패했습니다.');
					}
				} catch (err) {
					setErrorMessages('메시지를 불러오는 도중 오류가 발생했습니다.');
					console.error('메시지 불러오기 오류:', err);
				} finally {
					setLoadingMessages(false);
				}
			}
		};

		fetchMessages();
	}, [user_id, selectedChat]);

	// 새로운 메시지가 추가될 때 스크롤을 아래로 이동
	useEffect(() => {
		chatContentRef.current?.scrollTo({
			top: chatContentRef.current.scrollHeight,
			behavior: 'smooth',
		});
	}, [messages, selectedChat, chatHistory]);

	// 새 채팅 생성 핸들러
	const handleCreateChat = async () => {
		if (!inputValue || !selectedImage) {
			alert('제목과 캐릭터를 선택해주세요.');
			return;
		}

		// character_name이 "미국" 또는 "영국"인지 확인
		if (!['미국', '영국'].includes(selectedImage)) {
			alert('유효하지 않은 캐릭터 이름입니다.');
			return;
		}

		try {
			const response = await post(`/chat/${user_id}/chat`, {
				title: inputValue,
				character_name: selectedImage,
			});

			if (response.code === 200) {
				setChatHistory((prev) => [response.data, ...prev]);
				setSelectedChat(response.data);
				setIsModalOpen(false);
			} else {
				alert(response.message || '채팅 생성에 실패했습니다.');
			}
		} catch (error) {
			console.error('새 채팅 생성 실패:', error);
			alert('채팅 생성 중 오류가 발생했습니다.');
		}
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
							{loadingChats ? (
								<p>Loading...</p>
							) : errorChats ? (
								<p style={{ color: 'red' }}>{errorChats}</p>
							) : (
								<SubjectList>
									{chatHistory.map((history) => (
										<SubjectItem key={history.chat_id} onClick={() => setSelectedChat(history)}>
											<span role='img' aria-label='flag'>
												{history.character_name === '미국' ? '🇺🇸' : '🇬🇧'}
											</span>
											<SubjectText>{history.title}</SubjectText>
											<DateDisplay>{new Date(history.updated_at).toLocaleDateString()}</DateDisplay>
										</SubjectItem>
									))}
								</SubjectList>
							)}
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
							<TitleLarge>{selectedChat?.title || 'Subject1'}</TitleLarge>
							<TitleSmall>
								{selectedChat ? `${new Date(selectedChat.updated_at).toLocaleDateString()}` : 'yyyy.mm.dd'}
							</TitleSmall>
						</ChatTitle>
					</ChatHeader>
					<StyledHr />
					<ChatContent ref={chatContentRef}>
						{loadingMessages ? (
							<p>Loading messages...</p>
						) : errorMessages ? (
							<p style={{ color: 'red' }}>{errorMessages}</p>
						) : messages.length > 0 ? (
							messages.map((message, index) => (
								<ChatBubble
									key={index}
									message={message}
									isFeedbackVisible={feedbackVisibility[index] || false}
									toggleFeedback={() => toggleFeedback(index)}
								/>
							))
						) : (
							<p>Start the conversation!</p>
						)}
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
							<img src='/public/usa.png' alt='미국' className={selectedImage === '미국' ? 'selected' : ''} />
						</Button>
						<Button padding='none' rounded='full' onClick={() => setSelectedImage('영국')}>
							<img src='/public/uk.png' alt='영국' className={selectedImage === '영국' ? 'selected' : ''} />
						</Button>
					</ImageSelector>
					<InputBox placeholder='Enter your topic' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
					<ButtonWrapper>
						<Button varient='white' rounded='sm' border='black' onClick={handleCreateChat}>
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
	transition:
		width 0.3s ease,
		padding 0.3s ease;
	position: relative;
	overflow-y: scroll;
	max-height: 70vh;
	border-bottom: 6px solid #d4d5c8;
	-ms-overflow-style: none; /* IE 및 Edge용 */
	scrollbar-width: none; /* Firefox용 */

	&::-webkit-scrollbar {
		display: none;
	}
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
`;

const SubjectItem = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
	background-color: var(--neutral-10);
	border-radius: 0.5rem;
	cursor: pointer;
`;

const SubjectText = styled.span`
	flex-grow: 1;
	margin: 0 0.5rem; /* 텍스트의 좌우 간격 */
	font-size: 1rem;
	color: #333; /* 기본 텍스트 색상 */
	overflow: hidden; /* 내용이 길어질 경우 숨김 처리 */
	text-overflow: ellipsis; /* 생략 기호 추가 */
	white-space: nowrap; /* 한 줄로 표시 */
`;

const DateDisplay = styled.span`
	font-size: 0.875rem;
	color: #6c757d;
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
