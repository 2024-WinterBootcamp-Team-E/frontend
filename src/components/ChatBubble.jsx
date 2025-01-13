import styled from 'styled-components';
import { TextSizeS } from '@/GlobalStyle';
import Bubble from './Bubble';

const ChatBubble = ({ message }) => {
	const role = message.role;
	console.log({ message });
	return (
		<ChatBubbleWrapper>
			<ChatterName role={role}>{role}</ChatterName>
			<Bubble message={message} />
		</ChatBubbleWrapper>
	);
};
export default ChatBubble;

export const ChatBubbleWrapper = styled.div`
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
	padding: 0 0.5rem;
	text-align: ${({ role }) => (role != 'user' ? 'start' : 'end')};
	width: 100%;
`;


