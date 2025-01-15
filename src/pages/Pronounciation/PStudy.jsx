import styled from 'styled-components';
import Button from '@/components/Button';
import Layout from '@/components/Layout';
import { pretendard_bold, pretendard_medium, TextSizeM, TextSizeL } from '@/GlobalStyle';
import RecordButton from '@/components/RecordButton';

const PStudy = () => {
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
							<Button aria-label='Play Question'>재생</Button>
							<h3>If you need any assistance with the task, feel free to let me know.</h3>
						</QuestionContainer>
						<AnswerContainer>
							<Button aria-label='Play Answer'>재생</Button>
							<RecordButton aria-label='Record Answer' />
							<div>Sound Wave</div>
						</AnswerContainer>
					</ContentSection>
					<FeedbackSection>
						<ProgressCircle>93%</ProgressCircle>
						<FeedbackText>
							<p>You got it!</p>
							<span>Select the underlined word(s) for additional feedback.</span>
						</FeedbackText>
						<Button varient='green' rounded='xl' aria-label='Continue to Next'>
							Continue
						</Button>
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
	background-color: var(--success-border);
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
	color: var(--success-pressed);
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
		color: var(--success-pressed);
		${pretendard_bold}
		${TextSizeL}
	}
	span {
		color: var(--success-pressed);
		${pretendard_medium}
		${TextSizeM}
	}
	text-align: start;
`;
