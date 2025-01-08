import React from 'react';
import useSampleStore from '@/store';

const Home = () => {
	const count = useSampleStore((state) => state.count);
	const increment = useSampleStore((state) => state.increment);
	const decrement = useSampleStore((state) => state.decrement);

	return (
		<div>
			<h1>Home Page</h1>
			<p>Count : {count}</p>
			<button onClick={increment}>Increment</button>
			<button onClick={decrement}>Decrement</button>
		</div>
	);
};

export default Home;
