import React, { useState } from 'react';
import useSampleStore from '@/store';
import styled from 'styled-components';
import Button from '@/components/Button';
import DropDown from '@/components/DropDown';
import ChatBubble from '@/components/ChatBubble';
import chatData from '@/mock/chatData';
import RecordButton from '@/components/RecordButton'; 

const Home = () => {
	const count = useSampleStore((state) => state.count);
	const increment = useSampleStore((state) => state.increment);
	const decrement = useSampleStore((state) => state.decrement);
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const messages = chatData.messages;
	console.log('home', messages);
	return (
		<StyledBackGround>
			<TestH1>Home Page</TestH1>
			<TestP>Count : {count}</TestP>
			<div>
				<Button onClick={increment} varient='white'>
					Increment
				</Button>
				<Button onClick={decrement} varient='white'>
					Decrement
				</Button>
			</div>
			<Button onClick={() => setIsDropDownOpen(!isDropDownOpen)} varient='white'>
				setIsDropDownOpen
			</Button>
			<DropDown isDropDownOpen={isDropDownOpen} />
			{messages.map((message, index) => (
				<ChatBubble key={index} message={message} />
			))}
		</StyledBackGround>
	);
};

const StyledBackGround = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 4rem;
`;

const TestH1 = styled.h1`
	color: var(--primary-main);
`;

const TestP = styled.p`
	font-size: 1rem;
`;

export default Home;
