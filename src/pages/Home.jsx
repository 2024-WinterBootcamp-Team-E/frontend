import React, { useState } from 'react';
import useSampleStore from '@/store';
import styled from 'styled-components';
import Button from '@/components/Button';
import DropDown from '@/components/DropDown';

const Home = () => {
	const count = useSampleStore((state) => state.count);
	const increment = useSampleStore((state) => state.increment);
	const decrement = useSampleStore((state) => state.decrement);
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
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
		</StyledBackGround>
	);
};

const StyledBackGround = styled.div`
	background-color: var(--neutral-50);
	width: 100%;
	height: 100%;
	padding: 4rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const TestH1 = styled.h1`
	color: var(--primary-main);
`;

const TestP = styled.p`
	font-size: 1rem;
`;

export default Home;
