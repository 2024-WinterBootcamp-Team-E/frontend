import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import Layout from '@/components/Layout';
import PlayButton from '@/components/PlayButton';
import SoundWave from '@/components/SoundWave';
import { Evaluation } from '@/mock/Evaluation';
import { pretendard_medium, pretendard_bold, TextSizeM, TextSizeL } from '@/GlobalStyle';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8000'; // 백엔드 기본 URL 설정

const PStudy = () => {
	const location = useLocation();
	const { category } = location.state || {};
	const [sentences, setSentences] = useState([]); // 문장 데이터 상태
	const [currentIndex, setCurrentIndex] = useState(0); // 현재 문장 인덱스
	const [evaluation, setEvaluation] = useState('info'); // info, success, warning, danger
	const [loading, setLoading] = useState(false); // 로딩 상태 추가
	const audioRef = useRef(null); // audio 엘리먼트를 위한 ref
	const totalScore = 92;

	// 상황에 따라 문장 가져오기
	useEffect(() => {
		if (category) {
			console.log('Fetching sentences for category:', category); // 카테고리 확인
			fetchSentences(category.toUpperCase());
		} else {
			console.error('No category provided');
		}
	}, [category]);

	const fetchSentences = async (situation) => {
		try {
		  const response = await axios.get('/api/v1/speech/situationType/all', {
			params: { situation },
		  });
		  console.log('API Response:', response.data);
		  setSentences(response.data.data || []);
		} catch (error) {
		  console.error('Error fetching sentences:', error);
		}
	  };

	const handlePlayAudio = () => {
		if (audioRef.current) {
			audioRef.current.play();
		}
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
	};
	
	const handlePrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + sentences.length) % sentences.length);
	};
	
	  return (
		<Layout>
		  <MainContent>
			<StudyContainer>
			  <ProgressSection>
				<p>
				  {sentences.length > 0
					? `${currentIndex + 1} of ${sentences.length}`
					: 'No Sentences'}
				</p>
				<a href='/pronunciation'>Quit</a>
			  </ProgressSection>
			  <ContentSection>
				{loading ? (
				  <p>Loading sentences...</p>
				) : sentences.length > 0 ? (
				  <>
					<QuestionContainer>
					  <PlayButton aria-label='Play Question' onClick={handlePlayAudio}>
						재생
					  </PlayButton>
					  <h3>{sentences[currentIndex]}</h3> {/* 현재 문장 표시 */}
					</QuestionContainer>
					<AnswerContainer>
					  <SoundWave />
					</AnswerContainer>
					{/* Audio 엘리먼트 추가 */}
					<audio 
						ref={audioRef} 
						src={sentences[currentIndex]?.voice_url || ''} 
						controls 
						onError={() => console.error('Failed to load audio')}
					/>
					<NavigationButtons>
					  <Button onClick={handlePrevious} disabled={sentences.length === 1}>
						Previous
					  </Button>
					  <Button onClick={handleNext} disabled={sentences.length === 1}>
						Next
					  </Button>
					</NavigationButtons>
				  </>
				) : (
				  <p>No sentences available for this category.</p>
				)}
			  </ContentSection>
			  <FeedbackSection evaluation={evaluation}>
				<ProgressCircle evaluation={evaluation}>{totalScore}%</ProgressCircle>
				<FeedbackText evaluation={evaluation}>
				  <p>{Evaluation.evaluation}</p>
				  <span>Select the underlined word(s) for additional feedback.</span>
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
			color: initial;
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
	gap: 1rem;
`;

const AnswerContainer = styled.div`
	align-items: center;
	display: flex;
	gap: 1rem;
`;

const FeedbackSection = styled.div`
	align-items: center;
	background-color: ${(props) => {
		switch (props.evaluation) {
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

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: none;
    background-color: var(--primary-color);
    color: #000000;
    cursor: pointer;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;
