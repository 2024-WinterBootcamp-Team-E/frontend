import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Header from '@/components/Header';
const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/header' element={<Header/>}/>
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
