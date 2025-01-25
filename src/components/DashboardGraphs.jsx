import React, { useEffect, useState } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Filler,
	Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { get } from '@/api';
import styled from 'styled-components';
import { BlackTie } from 'styled-icons/fa-brands';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Filler, Tooltip, Legend);

const DashboardGraphs = () => {
	const [averageScores, setAverageScores] = useState([]); // 평균 점수 초기 상태 빈 배열
	const [weakPoints, setWeakPoints] = useState([]); // 약점 초기 상태 빈 배열
	// const userId = sessionStorage.getItem('userId');
	const userId = 19;

	useEffect(() => {
		// 평균 점수 Get
		const fetchAverageScores = async () => {
			try {
				const response = await get(`/feedback/${userId}/123/score`);
				if (response) {
					// 최대 최근 10개의 항목을 가져오고 순서를 뒤집기
					const limitedData = response.data.slice(0, 10).reverse();
					setAverageScores(limitedData); // 데이터를 상태에 저장
				} else {
					console.error('데이터를 가져오는 데 실패했습니다:', response.message || 'Unknown error');
				}
			} catch (error) {
				console.error('평균 점수 API 호출 중 오류 발생:', error);
			}
		};
		// 약점 Get
		const fetchWeakPoints = async () => {
			try {
				const response = await get(`/feedback/${userId}/weak_pronunciations`);
				const weakPronunciations = response.data?.top_weak_pronunciations || []; // null이면 빈 배열로 대체
				setWeakPoints(weakPronunciations);
			} catch (error) {
				console.error(' 약점 API 호출 중 오류 발생:', error);
			}
		};

		fetchAverageScores(); // 비동기 함수 호출
		fetchWeakPoints();

		console.log(weakPoints);
	}, [userId]);

	if (!averageScores.length) {
		return <div>Loading...</div>; // 데이터 로드 중 표시
	}

	// 날짜를 YY/mm/dd 형식으로 변환
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
		const year = String(date.getFullYear()).slice(-2); // 연도 마지막 두 자리를 가져오기

		return `${year}/${month}/${day}`;
	};

	// 평균 점수 라벨 <= 날짜와 점수를 각각 추출
	const averageLabels = averageScores.map((item) => formatDate(item.date));
	const accuracyScores = averageScores.map((item) => item.average_accuracy_score);
	const fluencyScores = averageScores.map((item) => item.average_fluency_score);
	const completenessScores = averageScores.map((item) => item.average_completeness_score);
	const pronScores = averageScores.map((item) => item.average_pron_score);
	// 평균 점수 그래프 옵션
	const averageOptions = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
				fullSize: true,
			},
			title: {
				display: true,
				text: 'Average Scores',
				color: '#0a0a0a',
			},
		},
		scales: {
			x: {
				title: {
					display: false,
					text: 'Date',
				},
			},
			y: {
				title: {
					display: false,
					text: 'Score',
				},
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
				],
				min: 0,
				max: 100,
			},
		},
		layout: {
			width: 10,
		},
	};
	// 평균 점수 그래프 데이터
	const averageData = {
		labels: averageLabels,
		datasets: [
			{
				label: 'Accuracy',
				data: accuracyScores,
				borderColor: 'rgb(253, 175, 189)',
				backgroundColor: 'rgba(253, 175, 189, 0.3)',
				tension: 0.4,
				fill: true,
				tension: 0.1,
			},
			{
				label: 'Fluency',
				data: fluencyScores,
				borderColor: 'rgb(152, 207, 240)',
				backgroundColor: 'rgba(152, 207, 240, 0.3)',
				tension: 0.4,
				fill: true,
				tension: 0.1,
			},
			{
				label: 'Completeness',
				data: completenessScores,
				borderColor: 'rgb(253, 229, 166)',
				backgroundColor: 'rgba(253, 229, 166, 0.3)',
				tension: 0.4,
				fill: true,
				tension: 0.1,
			},
			{
				label: 'Pronunciation',
				data: pronScores,
				borderColor: 'rgb(163, 222, 179)',
				backgroundColor: 'rgba(163, 222, 179, 0.3)',
				tension: 0.4,
				fill: true,
				tension: 0.1,
			},
		],
	};

	const weakOptions = {
		maintainAspectRatio: false,
		plugins: {
			title: {
				display: true,
				text: 'Weak Point',
				color: '#0a0a0a',
			},
			legend: {
				position: 'right', // 범례를 왼쪽에 배치
				// fullSize: true,
			},
		},
	};

	// 약점 데이터
	const weakData = {
		labels: weakPoints.map((item) => `${item.syllable} : ${item.words}`),
		datasets: [
			{
				label: 'count ',
				data: weakPoints.map((item) => item.count),
				backgroundColor: [
					// 251 252 246
					'rgba(253, 175, 189, 0.5)',
					'rgba(152, 207, 240, 0.5)',
					'rgba(253, 229, 166, 0.5)',
					'rgba(163, 222, 179, 0.5)',
					'rgba(202, 177, 250, 0.5)',
				],
				borderColor: [
					'rgba(253, 175, 189, 1)',
					'rgba(152, 207, 240, 1)',
					'rgba(253, 229, 166, 1)',
					'rgba(163, 222, 179, 1)',
					'rgba(202, 177, 250, 1)',
				],
				borderWidth: 1,
				hoverOffset: 4,
			},
		],
	};

	return (
		<GraphWrapper>
			<GraphDiv>
				<Line options={averageOptions} data={averageData} />
			</GraphDiv>
			<GraphDiv>
				<Pie options={weakOptions} data={weakData} />
			</GraphDiv>
		</GraphWrapper>
	);
};

export default DashboardGraphs;

const GraphWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 1rem;
	width: 100%;
	height: 14.5rem;
	canvas {
		height: 100%;
	}
`;

const GraphDiv = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	align-items: center;
	justify-content: center;
`;