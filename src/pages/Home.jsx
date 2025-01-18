import React, { useState } from 'react';
import { useSampleStore } from '@/store';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { pretendard_bold, pretendard_light, TextSizeXL, TextSizeL } from '@/GlobalStyle';

const HomePage = () => {
	const navigate = useNavigate(); // navigate 함수 초기화

	return (
		<Layout isLanding='landing'>
			<Container>
				<Title>Online English Speaking Practice Platform</Title>
				<Subtitle>
					It is a free speaking practice platform where you can start your practicing via AI trainer anywhere anytime.
				</Subtitle>
				<Button varient='black' rounded='full' padding='getstarted' onClick={() => navigate('/signin')}>
					<BoldLgText>
						<span>Get Started</span>
					</BoldLgText>
				</Button>
			</Container>
		</Layout>
	);
};

export default HomePage;

// Styled Components
const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	padding: 2rem;
	background-color: var(--secondary-main);
	text-align: center;
`;

const Title = styled.h1`
	font-size: 5rem;
	color: var(--neutral-100);
	${pretendard_bold}
	margin-bottom: 1rem;
	line-height: 1.5;
`;

const Subtitle = styled.p`
	${pretendard_light}
	${TextSizeXL}
color: var(--neutral-100);
	max-width: 39.5rem;
	margin-bottom: 1.5rem;
	line-height: 1.5;
`;

const BoldLgText = styled.span`
	${pretendard_bold}
	${TextSizeL}
  span {
		color: var(--neutral-10);
	}
`;
