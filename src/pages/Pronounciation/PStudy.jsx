import styled from 'styled-components';
import Button from '@/components/Button';
import Layout from '@/components/Layout';
import { pretendard_bold, pretendard_medium, TextSizeM, TextSizeL } from '@/GlobalStyle';
import RecordButton from '@/components/RecordButton';
import PlayButton from '@/components/PlayButton';
import { useState } from 'react';
import { Evaluation } from '@/mock/Evaluation';

const PStudy = () => {
	const [evaluation, setEvaluation] = useState('info'); // info, success, warning, danger
	const totalScore = 92;
	console.log(Evaluation.info);
	return (
		<Layout>
			<MainContent>
				<StudyContainer>
					<ProgressSection>
						<p>1 of 3</p>
						<a href='/pronounciation'>Quit</a>
					</ProgressSection>
					<ContentSection>
						<QuestionContainer>
							<PlayButton aria-label='Play Question'>재생</PlayButton>
							<h3>If you need any assistance with the task, feel free to let me know.</h3>
						</QuestionContainer>
						<AnswerContainer>
							<PlayButton aria-label='Play Question'>재생</PlayButton>
							<RecordButton aria-label='Record Answer' />
							<div>Sound Wave</div>
						</AnswerContainer>
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
	/* height: 100%; */
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
