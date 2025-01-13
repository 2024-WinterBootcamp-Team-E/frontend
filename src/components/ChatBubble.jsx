import styled from 'styled-components';
import { TextSizeS } from '@/GlobalStyle';

const ChatBubble = ({ isAI = false }) => {
	return (
		<ChatBubbleWrapper>
			<ChatterName>UserName</ChatterName>
			<Bubble isAI={isAI}>
				<p>I go to the park and meet my friend.</p>
			</Bubble>
		</ChatBubbleWrapper>
	);
};
export default ChatBubble;

const ChatBubbleWrapper = styled.div`
	align-items: end;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	height: fit-content;
	justify-content: center;
	width: fit-content;
`;

const ChatterName = styled.p`
	${TextSizeS}

	color: var(--neutral-80);
	height: fit-content;
	text-align: end;
	width: fit-content;
`;

const Bubble = styled.div`
	align-items: ${({ isAI }) => (isAI ? 'start' : 'end')};
	background-color: var(--neutral-10);
	border-radius: ${({ isAI }) => (isAI ? '1rem 1rem 1rem 0.1rem' : '1rem 1rem 0.1rem 1rem')};
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	height: fit-content;
	justify-content: center;
	max-width: 22.5rem;
	padding: 1rem;
	width: fit-content;
`;
