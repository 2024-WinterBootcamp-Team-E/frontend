import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // useParams 훅 추가
import styled from 'styled-components';
import ScaleLoader from 'react-spinners/ScaleLoader';
import Button from '@/components/Button';
import Layout from '@/components/Layout';
import PlayButton from '@/components/PlayButton';
import SoundWave from '@/components/SoundWave';
import { Evaluation } from '@/mock/Evaluation';
import { pretendard_medium, pretendard_bold, TextSizeM, TextSizeL } from '@/GlobalStyle';
import { get } from '@/api';

const PStudy = () => {
	const location = useLocation();
  	const searchParams = new URLSearchParams(location.search);
  	const category = searchParams.get('category'); // 쿼리 파라미터에서 category 추출
	const [evaluation, setEvaluation] = useState('info'); // info, success, warning, danger
	const [sentenceData, setSentenceData] = useState(null); // 데이터 상태 추가
	const [totalScore, setTotalScore] = useState(92);
	const [isLoading, setIsLoading] = useState(false);
	const audioRef = useRef(null); // audio 엘리먼트를 위한 ref
	const userId = sessionStorage.getItem('userId'); // 유저id 가져오는 함수
	const sentenceId = 2;

	useEffect(() => {
		const fetchSentenceData = async () => {
			setIsLoading(true);
			try {
				const response = await get(`/speech/${sentenceId}`);
				setSentenceData(response.data); // 데이터 상태 저장
				console.log('Fetched Sentence Data:', response);
			} catch (error) {
				console.error('Error fetching sentence data:', error);
			} finally {
				// setIsLoading(false);
			}
		};
		fetchSentenceData();
	}, [userId]);

	const handlePlayAudio = () => {
		if (audioRef.current && sentenceData && sentenceData.voice_url) {
			audioRef.current.src = sentenceData.voice_url; // 오디오 URL 설정
			audioRef.current.play(); // 재생
		}
	};

	return (
		<Layout>
			<MainContent>
				<StudyContainer>
					<ProgressSection>
						<p>1 of 3</p>
						<a href='/pronunciation'>Quit</a>
					</ProgressSection>
					<ContentSection>
						{sentenceData ? (
							<>
								<QuestionContainer>
									<PlayButton aria-label='Play Question' onClick={handlePlayAudio}>
										재생
									</PlayButton>
									<h3>{sentenceData.content}</h3>
								</QuestionContainer>
								<AnswerContainer>
									<SoundWave />
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
						<ProgressCircle $evaluation={evaluation}>{totalScore}%</ProgressCircle>
						<FeedbackText $evaluation={evaluation}>
							<p>{Evaluation[evaluation].shortComment}</p>
							<span>{Evaluation[evaluation].longComment}</span>
						</FeedbackText>
						{evaluation === 'success' && (
							<Button varient='green' rounded='xl' aria-label='Continue to Next'>
								Continue
							</Button>
						)}
					</FeedbackSection>
				</StudyContainer>
			</MainContent>
		</Layout>
	);
};

export default PStudy;

// Styled Components
const MainContent = styled.div`
	display: flex;
	flex-grow: 1;
	height: 100%;
	padding: 1rem 2rem 2rem 2rem;
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

const FeedbackSection = styled.div`
	align-items: center;
	background-color: ${(props) => {
		switch (props.$evaluation) {
			case 'success':
				return 'var(--success-border)';
			case 'warning':
				return 'var(--warning-border)';
			case 'danger':
				return 'var(--danger-border)';
			case 'info':
			default:
				return 'var(--info-border)';
		}
	}};
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