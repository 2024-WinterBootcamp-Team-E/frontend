import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Intonation from '@/pages/Intonation';
import IStudy from '@/pages/Intonation/IStudy';
import Pronunciation from '@/pages/Pronounciation';
import PStudy from '@/pages/Pronounciation/PStudy';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
// import RecordTest from '@/pages/RecordTest';

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} /> {/* 홈페이지 */}
				<Route path='/intonation' element={<Intonation />} /> {/* 억양 선택 */}
				<Route path='/intonation/istudy' element={<IStudy />} /> {/* 억양 연습(채팅방) */}
				<Route path='/pronunciation' element={<Pronunciation />} /> {/* 발음 토픽 선택 */}
				<Route path='/pronunciation/pstudy' element={<PStudy />} /> {/* 발음 문장 연습 */}
				<Route path='/signin' element={<SignIn />} /> {/* 로그인 */}
				<Route path='/signup' element={<SignUp />} /> {/* 회원가입 */}
				{/* <Route path='/RecordTest' element={<RecordTest />} /> 버튼 */}
				<Route path='/' element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
