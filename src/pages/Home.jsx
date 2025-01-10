import React from 'react';
import useSampleStore from '@/store';
import styled from 'styled-components';
import Button from '../components/Button';

const TestH1 = styled.h1`
	color: var(--primary-main);
`;

const TestP = styled.p`
	font-size: 16px;
`;

const Home = () => {
	const count = useSampleStore((state) => state.count);
	const increment = useSampleStore((state) => state.increment);
	const decrement = useSampleStore((state) => state.decrement);

	return (
		<div>
			<TestH1>Home Page</TestH1>
			<TestP>Count : {count}</TestP>
			<Button onClick={increment}>Increment</Button>
			<Button onClick={decrement}>Decrement</Button>
		</div>
	);
};

export default Home;
