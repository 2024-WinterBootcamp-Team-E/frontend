import styled from 'styled-components';

const Bubble = ({ message }) => {
	const role = message.role;
	const content = message.content;
	const feedbacks = message.grammar_feedback || ''; // undefined 방지
	console.log('Bubble :', message);
	console.log('feedbacks :', feedbacks);

	// feedbacks가 비어있지 않으면 문장별로 분리
	const feedbackSentences = feedbacks.split(/\n|(?<=\.)\s+/).filter((sentence) => sentence.trim() !== '');
	console.log('feedbackSentences', feedbackSentences, feedbackSentences.length);

	return (
		<BubbleWrapper role={role}>
			<p>{content}</p>
			{feedbackSentences.length > 0 && <hr />}
			{feedbackSentences && feedbackSentences.map((feedbackSentence, index) => <p key={index}>{feedbackSentence}</p>)}
		</BubbleWrapper>
	);
};

export default Bubble;

const BubbleWrapper = styled.div`
	align-items: start;
	background-color: var(--neutral-10);
	border-radius: ${({ role }) => (role != 'user' ? '1rem 1rem 1rem 0.1rem' : '1rem 1rem 0.1rem 1rem')};
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	height: fit-content;
	justify-content: center;
	max-width: 22.5rem;
	padding: 1rem;
	width: fit-content;
	hr {
		width: 100%;
		margin: 0;
		padding: 0;
	}
	p {
		text-align: start;
	}
`;
