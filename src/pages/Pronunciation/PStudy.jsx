import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ScaleLoader from 'react-spinners/ScaleLoader';
import Button from '@/components/Button';
import Layout from '@/components/Layout';
import PlayButton from '@/components/PlayButton';
import SoundWave from '@/components/SoundWave';
import { pretendard_medium, pretendard_bold, TextSizeM, TextSizeL } from '@/GlobalStyle';
import { get } from '@/api';
import { ToggleOff, ToggleOn } from '@styled-icons/fa-solid';
import { useRecordStore } from '@/store'; // Zustand 스토어 import

const PStudy = () => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const category = searchParams.get('category'); // 쿼리 파라미터에서 category 추출
	const [evaluation, setEvaluation] = useState('info'); // info, success, warning, danger
	const [sentenceData, setSentenceData] = useState(null); // 데이터 상태 추가
	const [pronscore, setPronScore] = useState(0);
	const [feedbackText, setFeedbackText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef(null); // audio 엘리먼트를 위한 ref
	const userId = sessionStorage.getItem('userId'); // 유저id 가져오는 함수
	// 사이드바 관련 상태 및 함수
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
	const [selectedSentence, setSelectedSentence] = useState(null);
	const [sentences, setSentences] = useState([]); // API로부터 받아온 문장 데이터 저장

	const { resetRecordedAudio } = useRecordStore(); // reset 메서드 가져오기

	const toggleSidebar = () => {
		setIsSidebarExpanded(!isSidebarExpanded);
	};

	// 상황 타입별 매핑
	const categoryMapping = {
		Travel: '여행',
		Business: '비즈니스',
		Daily: '일상',
		Movie: '영화',
	};

	// category 변화 시 상황에 맞는 문장 데이터 가져오기
	useEffect(() => {
		const fetchSentences = async () => {
			const situation = categoryMapping[category] || '';
			try {
				const response = await get(`/speech/situationType/all?situation=${encodeURIComponent(situation)}`);
				setSentences(response.data);
			} catch (error) {
				console.error('Error fetching sentences:', error);
			}
		};
		if (category) fetchSentences();
	}, [category]);

	// sentences 변화 시 초기 선택된 문장 설정
	useEffect(() => {
		if (!selectedSentence && sentences.length > 0) {
			setSelectedSentence(sentences[0]);
		}
	}, [sentences, selectedSentence]);

	const currentIndex = selectedSentence
		? sentences.findIndex((sentence) => sentence.sentence_id === selectedSentence.sentence_id)
		: -1;

	// selectedSentence 변화 시 해당 문장 데이터 가져오기
	useEffect(() => {
		const fetchSentenceData = async () => {
			if (!selectedSentence) return;
			setIsLoading(true);
			try {
				const response = await get(`/speech/${selectedSentence.sentence_id}`);
				setSentenceData(response.data); // 데이터 상태 저장
				console.log('Fetched Sentence Data:', response);
			} catch (error) {
				console.error('Error fetching sentence data:', error);
			} finally {
				setIsLoading(false); // 로딩 상태 업데이트
			}
		};
		fetchSentenceData();
	}, [selectedSentence]);

	// 선택된 문장 변경 시 recordedAudio 및 feedbackText 초기화
	useEffect(() => {
		resetRecordedAudio();
		setFeedbackText('');
	}, [selectedSentence, resetRecordedAudio]);

	// 컴포넌트 언마운트 시 recordedAudio 초기화
	useEffect(() => {
		return () => {
			resetRecordedAudio();
		};
	}, [resetRecordedAudio]);

	useEffect(() => {
		if (audioRef.current) {
			const audioElement = audioRef.current;

			// 오디오 재생이 끝났을 때 isPlaying을 false로 설정
			const handleAudioEnded = () => {
				setIsPlaying(false);
			};

			audioElement.addEventListener('ended', handleAudioEnded);

			// cleanup: 이벤트 리스너 제거
			return () => {
				audioElement.removeEventListener('ended', handleAudioEnded);
			};
		}
	}, []);

	const handlePlayAudio = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause(); // 일시정지
				setIsPlaying(false); // 재생 상태를 false로 설정
			} else {
				if (sentenceData && sentenceData.voice_url) {
					audioRef.current.src = sentenceData.voice_url; // 오디오 URL 설정
					audioRef.current.play(); // 재생
					setIsPlaying(true);
				}
			}
		}
	};

	const handleResetFeedback = () => {
		setFeedbackText('');
	};

	const handleScoreUpdate = (scoreValue) => {
		setPronScore(scoreValue);
		if (scoreValue <= 30) setEvaluation('danger');
		else if (scoreValue <= 60) setEvaluation('warning');
		else setEvaluation('success');
	};

	const handleSSEUpdate = (textChunk) => {
		setFeedbackText((prev) => prev + textChunk);
	};

	const handleContinue = () => {
		// 현재 선택된 문장의 인덱스를 찾음
		const currentIndex = selectedSentence
			? sentences.findIndex((sentence) => sentence.sentence_id === selectedSentence.sentence_id)
			: -1;

		// 다음 인덱스 계산
		const nextIndex = currentIndex + 1;

		// 다음 문장이 존재하면 선택된 문장을 업데이트
		if (nextIndex < sentences.length) {
			setSelectedSentence(sentences[nextIndex]);
		} else {
			alert('마지막 문장입니다!');
		}
	};

	// sentenceId를 selectedSentence에서 동적으로 가져옴
	const dynamicSentenceId = selectedSentence ? selectedSentence.sentence_id : null;
	useEffect(() => {
		// 상태 초기화를 Promise.resolve()를 사용하여 마이크로태스크 큐에 넣기
		Promise.resolve().then(() => {
			resetRecordedAudio();
			setEvaluation('info');
			setPronScore(0);
		});

		// cleanup 함수에서도 초기화
		return () => {
			resetRecordedAudio();
		};
	}, [selectedSentence?.sentence_id]);
	return (
		<Layout>
			<MainContainer expanded={isSidebarExpanded}>
				{/* 사이드바 영역 */}
				<Sidebar expanded={isSidebarExpanded}>
					{isSidebarExpanded ? (
						<>
							<SidebarHeader>
								<h5>Sentence List</h5>
								<ToggleWrapper onClick={toggleSidebar}>
									<StyledToggleOff />
								</ToggleWrapper>
							</SidebarHeader>
							<StyledHr />
							<SubjectList>
								{sentences.map((sentenceItem, index) => (
									<SubjectItem
										key={sentenceItem.sentence_id} // key를 고유한 ID로 변경
										active={dynamicSentenceId === sentenceItem.sentence_id}
										onClick={() => setSelectedSentence(sentenceItem)}
									>
										<SubjectText>{sentenceItem.content}</SubjectText>
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
				<MainContent>
					<StudyContainer>
						<ProgressSection>
							<p>
								{currentIndex >= 0 ? currentIndex + 1 : 0} of {sentences.length}
							</p>
							<a href='/pronunciation'>Quit</a>
						</ProgressSection>
						<ContentSection>
							{sentenceData ? (
								<>
									<QuestionContainer>
										<PlayButton aria-label='Play Question' isPlaying={isPlaying} onClick={handlePlayAudio} />
										<h3>{sentenceData.content}</h3>
									</QuestionContainer>
									<AnswerContainer>
										{/* key 속성 제거 */}
										<SoundWave
											sentenceId={dynamicSentenceId}
											onScoreUpdate={handleScoreUpdate}
											onSSEUpdate={handleSSEUpdate}
											onResetFeedback={handleResetFeedback}
										/>
									</AnswerContainer>
									<audio ref={audioRef} src='/SampleAudio.wav' />
								</>
							) : (
								<ScaleLoader
									color={'#0a0a0a'}
									loading={isLoading}
									speedMultiplier={1.5}
									aria-label='Loading Spinner'
									data-testid='loader'
								/>
							)}
						</ContentSection>
						<FeedbackSection $evaluation={evaluation}>
							<ProgressCircle $evaluation={evaluation}>{pronscore}%</ProgressCircle>
							<FeedbackText $evaluation={evaluation}>
								<p>{feedbackText}</p>
							</FeedbackText>
							<Button varient='white' rounded='xl' aria-label='Continue to Next' onClick={handleContinue}>
								Continue
							</Button>
						</FeedbackSection>
					</StudyContainer>
				</MainContent>
			</MainContainer>
		</Layout>
	);
};

export default PStudy;
// Styled Components
const MainContainer = styled.div`
	display: grid;
	grid-template-columns: ${(props) => (props.expanded ? '20% 80%' : '5% 100%')};
	grid-gap: 1rem;
	background-color: traansparents;
	transition: grid-template-columns 0.3s ease;
	height: 70vh;
	padding: 1rem 2rem 2rem 2rem;
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
	background-color: ${({ active }) => (active ? '#acababaa' : 'var(--neutral-10)')};
	border-radius: 0.5rem;
	cursor: pointer;
	&:hover {
		background-color: ${({ active }) => (active ? '#0a0a0a80' : '#f0f0f0')};
	}
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

const MainContent = styled.div`
	display: flex;
	flex-grow: 1;
	height: 100%;
	width: 100%;
`;

const StudyContainer = styled.section`
	background-color: var(--neutral-10);
	border-radius: 2rem;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	gap: 2rem;
	width: 100%;
`;

const ProgressSection = styled.div`
	align-items: center;
	display: flex;
	justify-content: space-between;
	padding: 1.5rem 1.5rem 0 1.5rem;
	height: fit-content;

	p {
		${pretendard_medium}
		${TextSizeM}
	}

	a {
		${pretendard_medium}
		${TextSizeM}
    :link, :visited {
		}
		:hover {
			color: var(--neutral-50);
		}
	}
`;

const ContentSection = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	gap: 1.5rem;
	height: 100%;
	justify-content: center;
`;

const QuestionContainer = styled.div`
	align-items: center;
	display: flex;
	gap: 2rem;
	padding: 0 3rem;
	h3 {
		max-width: 50rem;
	}
`;

const AnswerContainer = styled.div`
	align-items: center;
	display: flex;
	gap: 1rem;
`;

const evaluationColors = {
	success: 'var(--success-border)',
	warning: 'var(--warning-border)',
	danger: 'var(--danger-border)',
	info: 'var(--info-border)',
};

const FeedbackSection = styled.div`
	align-items: center;
	background-color: ${(props) => evaluationColors[props.$evaluation] || evaluationColors.info};
	border-radius: 0 0 2rem 2rem;
	display: flex;
	flex-direction: row;
	gap: 1rem;
	gap: 0.75rem;
	padding: 1rem 2rem;
	width: 100%;
`;

const ProgressCircle = styled.div`
	${pretendard_medium}
	${TextSizeL};
	align-items: center;
	background-color: var(--neutral-10);
	border-radius: var(--rounded-full);
	color: ${(props) => {
		switch (props.evaluation) {
			case 'success':
				return 'var(--success-pressed)';
			case 'warning':
				return 'var(--warning-pressed)';
			case 'danger':
				return 'var(--danger-pressed)';
			case 'info':
			default:
				return 'var(--info-pressed)';
		}
	}};
	display: flex;
	height: 4.5rem;
	justify-content: center;
	width: 4.5rem;
`;

const FeedbackText = styled.div`
	align-items: start;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	justify-content: center;
	p {
		color: ${(props) => {
			switch (props.evaluation) {
				case 'success':
					return 'var(--success-pressed)';
				case 'warning':
					return 'var(--warning-pressed)';
				case 'danger':
					return 'var(--danger-pressed)';
				case 'info':
				default:
					return 'var(--info-pressed)';
			}
		}};
		${pretendard_bold}
		${TextSizeL}
	}
	span {
		color: ${(props) => {
			switch (props.evaluation) {
				case 'success':
					return 'var(--success-pressed)';
				case 'warning':
					return 'var(--warning-pressed)';
				case 'danger':
					return 'var(--danger-pressed)';
				case 'info':
				default:
					return 'var(--info-pressed)';
			}
		}};
		${pretendard_medium}
		${TextSizeM}
	}
	text-align: start;
`;
