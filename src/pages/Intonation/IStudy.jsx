import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatBubble from '@/components/ChatBubble';
import Layout from '@/components/Layout';
import RecordButton from '@/components/RecordButton';
import { AngleLeft, ToggleOff, ToggleOn, TrashCan } from '@styled-icons/fa-solid';
import Button from '@/components/Button';
import Modal from 'react-modal';
import { TextSizeS } from '@/GlobalStyle';
import { get, post, remove, postWithReadableStream_acc } from '@/api'; // API 헬퍼 임포트

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

	const user_id = sessionStorage.getItem('userId');

	// ========== 녹음 관련 상태 & ref ==========
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	// ========== MP3 재생 관련 ==========
	const audioContextRef = useRef(null);
	const isPlayingRef = useRef(false);
	const audioQueueRef = useRef([]);
	// ===== (2) 컴포넌트 마운트 시점에 AudioContext 초기화 =====
	useEffect(() => {
		initAudioContext();
		return () => {
			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
		};
	}, []);

	const initAudioContext = () => {
		if (!window.AudioContext) {
			console.warn('이 브라우저는 Web Audio API를 지원하지 않습니다.');
			return;
		}
		audioContextRef.current = new AudioContext();
	};
	// ===== TTS 오디오 재생을 위한 함수 추가 =====
	const playAudioFromBytes = (bytes) => {
		if (isPlayingRef.current) {
			// 이미 재생 중이라면 큐에 추가
			audioQueueRef.current.push(bytes);
			return;
		}

		const blob = new Blob([bytes], { type: 'audio/mpeg' }); // MP3 형식으로 가정
		const url = URL.createObjectURL(blob);
		const audio = new Audio(url);
		isPlayingRef.current = true;
		audio.play().catch((err) => {
			console.error('오디오 재생 오류:', err);
			URL.revokeObjectURL(url);
			isPlayingRef.current = false;
			// 필요 시 사용자에게 알림 표시
			alert('오디오 재생 중 오류가 발생했습니다.');
		});
		audio.onended = () => {
			URL.revokeObjectURL(url); // 메모리 해제
			isPlayingRef.current = false;
			if (audioQueueRef.current.length > 0) {
				const nextBytes = audioQueueRef.current.shift();
				playAudioFromBytes(nextBytes);
			}
		};
	};
	// ===== SSE 메시지 처리 =====
	const processSseMessage = (parsed) => {
		const { step, content, sentence_id } = parsed;

		if (step === 'transcription') {
			setMessages((prev) => [...prev, { role: 'user', content, grammarFeedback: '' }]);
		} else if (step === 'gpt_response') {
			setMessages((prev) => {
				if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') {
					const updated = {
						...prev[prev.length - 1],
						content: prev[prev.length - 1].content + content,
					};
					return [...prev.slice(0, -1), updated];
				} else {
					return [...prev, { role: 'assistant', content }];
				}
			});
		} else if (step === 'grammar_feedback') {
			setMessages((prev) => {
				const newMsgs = [...prev];
				for (let i = newMsgs.length - 1; i >= 0; i--) {
					if (newMsgs[i].role === 'user') {
						// grammarFeedback만 넣기
						newMsgs[i].grammarFeedback = content;
						break;
					}
				}
				return newMsgs;
			});
		} else if (step === 'tts_audio') {
			if (!sentence_id) {
				console.warn('tts_audio 메시지에 sentence_id가 없습니다.');
				return;
			}
			const mp3Bytes = base64ToUint8Array(content);
			playAudioFromBytes(mp3Bytes);
		} else if (step === 'error') {
			console.error('SSE error:', parsed.message);
		}
	};

	// base64 → Uint8Array
	const base64ToUint8Array = (base64) => {
		try {
			const binary = atob(base64);
			const length = binary.length;
			const bytes = new Uint8Array(length);
			for (let i = 0; i < length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			return bytes;
		} catch (error) {
			console.error('Base64 디코딩 오류:', error);
			// 사용자에게 오류 알림 표시 (예시)
			alert('오디오 데이터를 디코딩하는 중 오류가 발생했습니다.');
			return new Uint8Array();
		}
	};

	const playTtsQueue = () => {
		if (isPlayingRef.current) return; // 이미 재생 중이면 대기
		if (ttsPlaybackQueueRef.current.length === 0) return; // 큐가 비어있으면 대기

		const audioBuffer = ttsPlaybackQueueRef.current.shift();
		if (audioBuffer && audioContextRef.current) {
			isPlayingRef.current = true;
			audioContextRef.current
				.decodeAudioData(audioBuffer)
				.then((decodedData) => {
					const source = audioContextRef.current.createBufferSource();
					source.buffer = decodedData;
					source.connect(audioContextRef.current.destination);
					source.start(0);
					source.onended = () => {
						isPlayingRef.current = false;
						playTtsQueue(); // 다음 오디오 재생
					};
				})
				.catch((err) => {
					console.error('MP3 디코딩 오류:', err);
					isPlayingRef.current = false;
					playTtsQueue(); // 에러 발생 시 다음 오디오 재생 시도
				});
		}
	};
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
					} else if (sortedData.length > 0 && selectedChat) {
						// 선택된 채팅방이 삭제되지 않았는지 확인
						const exists = sortedData.find((chat) => chat.chat_id === selectedChat.chat_id);
						if (!exists) {
							setSelectedChat(sortedData[0]);
						}
					} else {
						setSelectedChat(null);
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
	}, [user_id]); // selectedChat을 의존성 배열에서 제거

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
			} else {
				setMessages([]); // selectedChat이 null일 경우 메시지 초기화
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
		} finally {
			setInputValue('');
		}
	};
	// ========== 녹음 시작 / 중지 메서드 ==========
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			audioChunksRef.current = [];

			// MediaRecorder에서 데이터가 들어올 때마다 audioChunksRef에 push
			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorderRef.current.start();
			console.log('녹음 시작!');
		} catch (error) {
			console.error('마이크 접근 오류:', error);
		}
	};

	const stopRecording = async () => {
		console.log('녹음 중지!');
		if (!mediaRecorderRef.current) return;

		// MediaRecorder 정지
		mediaRecorderRef.current.stop();

		// 녹음이 실제로 정지되고 onstop 콜백이 불리기 전까지는 잠깐의 지연이 있을 수 있음
		mediaRecorderRef.current.onstop = async () => {
			const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
			audioChunksRef.current = []; // 다음 녹음을 위해 초기화

			// 녹음된 Blob을 서버에 전송
			await handleSendRecordedAudio(audioBlob);
		};
	};

	// 서버 전송 + SSE 스트리밍 수신
	const handleSendRecordedAudio = async (audioBlob) => {
		try {
			if (!selectedChat) {
				alert('채팅방을 선택해주세요.');
				return;
			}
			const formData = new FormData();
			formData.append('file', audioBlob, 'recorded.wav');

			let buffer = ''; // 버퍼 문자열 초기화

			await postWithReadableStream_acc(`/chat/${user_id}/${selectedChat.chat_id}`, formData, true, (chunk) => {
				buffer += chunk; // 청크를 버퍼에 추가

				// 버퍼에서 '\n\n'으로 분리된 이벤트 단위로 처리
				let parts = buffer.split('\n\n');

				// 마지막 청크는 완전하지 않을 수 있으므로 제외하고 처리
				buffer = parts.pop();

				parts.forEach((part) => {
					if (!part.trim()) return;
					if (part.startsWith('data: ')) {
						try {
							const jsonStr = part.replace('data: ', '').trim();
							const parsed = JSON.parse(jsonStr);
							processSseMessage(parsed);
						} catch (e) {
							console.error('SSE JSON 파싱 오류:', e);
						}
					}
				});
			});

			// 스트림이 끝난 후 남은 버퍼 처리
			if (buffer.trim()) {
				const part = buffer.trim();
				if (part.startsWith('data: ')) {
					try {
						const jsonStr = part.replace('data: ', '').trim();
						const parsed = JSON.parse(jsonStr);
						processSseMessage(parsed);
					} catch (e) {
						console.error('SSE JSON 파싱 오류:', e);
					}
				}
			}
		} catch (err) {
			console.error('오디오 전송/스트리밍 오류:', err);
		}
	};

	const handleRecordButtonClick = () => {
		setIsRecording((prev) => {
			const next = !prev;
			if (!prev) startRecording();
			else stopRecording();
			return next;
		});
	};

	// 채팅방 제거 함수
	const removeChatroom = async (chatId) => {
		try {
			const userConfirmed = window.confirm('정말로 이 채팅방을 삭제하시겠습니까?');

			if (!userConfirmed) {
				console.log('채팅방 삭제가 취소되었습니다.');
				return;
			}

			const response = await remove(`/chat/${user_id}/${chatId}`);
			console.log('removeChatroom:', response);

			if (response.code === 200) {
				// 현재 chatHistory 상태를 기준으로 새로운 목록 생성
				const updatedChatHistory = chatHistory.filter((chat) => chat.chat_id !== chatId);
				setChatHistory(updatedChatHistory);

				// 새로운 채팅방이 남아있으면 첫 번째 채팅방을 선택, 없으면 null로 설정
				if (updatedChatHistory.length > 0) {
					setSelectedChat(updatedChatHistory[0]);
				} else {
					setSelectedChat(null);
				}

				alert('채팅방이 삭제되었습니다.');
			} else {
				alert(response.message || '채팅방 삭제에 실패했습니다.');
			}
		} catch (error) {
			console.error('removeChatroom:', error);
			alert('채팅방 삭제 중 오류가 발생했습니다.');
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
							<Button varient='plus' rounded='sm' padding='sm' size='wide' onClick={() => setIsModalOpen(true)}>
								<PlusText>+</PlusText>
							</Button>
							{loadingChats ? (
								<p>Loading...</p>
							) : errorChats ? (
								<p style={{ color: 'red' }}>{errorChats}</p>
							) : chatHistory.length > 0 ? (
								<SubjectList>
									{chatHistory.map((history) => (
										<SubjectItem key={history.chat_id} onClick={() => setSelectedChat(history)}>
											<img
												src={history.character_name === '미국' ? '/us_icon.png' : '/uk_icon.png'}
												alt={history.character_name === '미국' ? 'us' : 'uk'}
												style={{
													width: '1.25rem',
													height: '1.5rem',
													marginRight: '0.3rem',
												}}
											/>
											<SubjectText>{history.title}</SubjectText>
											<DateDisplay>
												{new Date(history.updated_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
											</DateDisplay>
										</SubjectItem>
									))}
								</SubjectList>
							) : (
								<p>Start the conversation!</p>
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
							<TitleLarge>{selectedChat?.title || 'Start the conversation!'}</TitleLarge>
							<TitleSmall>{selectedChat ? `${new Date(selectedChat.updated_at).toLocaleDateString()}` : ''}</TitleSmall>
							<span />
							{selectedChat && (
								<Button rounded='sm' padding='sm' varient='white' onClick={() => removeChatroom(selectedChat.chat_id)}>
									<DeleteText>-</DeleteText>
								</Button>
							)}
						</ChatTitle>
					</ChatHeader>
					<StyledHr />
					<ChatContent ref={chatContentRef}>
						{loadingMessages ? (
							<p>Loading messages...</p>
						) : errorMessages ? (
							<p style={{ color: 'red' }}>{errorMessages}</p>
						) : selectedChat ? (
							messages.length > 0 ? (
								messages.map((message, index) => (
									<ChatBubble
										key={index}
										character={selectedChat.character_name}
										message={message}
										isFeedbackVisible={feedbackVisibility[index] || false}
										toggleFeedback={() => toggleFeedback(index)}
									/>
								))
							) : (
								<p>Start the conversation!</p>
							)
						) : (
							<p>Start the conversation!</p>
						)}
					</ChatContent>
					<RecordSection>
						<RecordButton where='istudy' isRecording={isRecording} onClick={handleRecordButtonClick} />
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
							<img src='/usa.png' alt='미국' className={selectedImage === '미국' ? 'selected' : ''} />
						</Button>
						<Button padding='none' rounded='full' onClick={() => setSelectedImage('영국')}>
							<img src='/uk.png' alt='영국' className={selectedImage === '영국' ? 'selected' : ''} />
						</Button>
					</ImageSelector>
					<InputBox
						placeholder='Enter your topic'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						defaultValue={''}
					/>
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
	height: 85vh;
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
	margin: 0 0.2rem; /* 텍스트의 좌우 간격 */
	font-size: 1rem;
	color: #333; /* 기본 텍스트 색상 */
	overflow: hidden; /* 내용이 길어질 경우 숨김 처리 */
	text-overflow: ellipsis; /* 생략 기호 추가 */
	white-space: nowrap; /* 한 줄로 표시 */
	text-align: start;
`;

const DateDisplay = styled.span`
	font-size: 0.7rem;
	color: #6c757d;
	white-space: nowrap; /* 한 줄로 표시 */
`;

const ChatSection = styled.section`
	position: relative;
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

const AngleLeftIcon = styled(AngleLeft)`
	color: var(--neutral-100);
	width: 1.25rem;
	height: 1.25rem;
`;

const ChatTitle = styled.div`
	display: flex;
	flex-direction: row;
	margin: 0;
	font-size: 1.25rem; /* 적절한 크기로 설정 */
	color: var(--neutral-100); /* 텍스트 색상 */
	white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 설정 */
	overflow: hidden; /* 텍스트가 길면 숨김 처리 */
	gap: 0.5rem;
	align-items: center;
	width: 100%;
	span {
		flex-grow: 1;
	}
`;

const TitleLarge = styled.p`
	font-size: 1.5rem;
	font-weight: bold;
	color: var(--neutral-100);
	width: fit-content;
`;

const TitleSmall = styled.p`
	${TextSizeS}
	color: var(--neutral-70);
	text-align: center;
	width: fit-content;
`;

const ChatContent = styled.div`
	flex: 1;
	overflow-y: auto;
	margin-top: 1rem;

	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.4);
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 6px;
	}
`;

const RecordSection = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 1rem;
	position: absolute;
	bottom: 2rem;
	left: 50%;
	transform: translateX(-50%);
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

const PlusText = styled.p`
	font-size: 1.5rem;
	color: var(--neutral-100);
	text-align: center;
`;

const DeleteText = styled(TrashCan)`
	color: var(--danger-main);
	width: 1rem;
	height: 1rem;
`;

export default IStudy;
