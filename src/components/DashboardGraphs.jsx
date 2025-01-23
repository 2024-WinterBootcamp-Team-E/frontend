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
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: false,
				text: 'Average Scores Over Time',
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
					display: true,
					text: 'Score',
				},
				min: 0,
				max: 100,
			},
		},
	};
	// 평균 점수 그래프 데이터
	const averageData = {
		labels: averageLabels,
		datasets: [
			{
				label: 'Accuracy',
				data: accuracyScores,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.3)',
				tension: 0.4,
				fill: true,
				tension: 0.1,
			},
			{
				label: 'Fluency',
				data: fluencyScores,
				borderColor: 'rgb(54, 162, 235)',
				backgroundColor: 'rgba(54, 162, 235, 0.3)',
				tension: 0.4,
				fill: true,
				tension: 0.1,
			},
			{
				label: 'Completeness',
				data: completenessScores,
				borderColor: 'rgb(255, 206, 86)',
				backgroundColor: 'rgba(255, 206, 86, 0.3)',
				tension: 0.4,
				fill: true,
				tension: 0.1,
			},
			{
				label: 'Pronunciation',
				data: pronScores,
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.3)',
				tension: 0.4,
				fill: true,
				tension: 0.1,
			},
		],
	};

	const weakOptions = {
		layout: {
			padding: 20,
		},
	};

	// 약점 데이터
	const weakData = {
		labels: weakPoints.map((item) => item.syllable),
		datasets: [
			{
				label: 'count ',
				data: weakPoints.map((item) => item.count),
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
				],
				borderWidth: 1,
				hoverOffset: 4,
			},
		],
	};

	return (
		<GraphWrapper>
			<Line options={averageOptions} data={averageData} />
			<Pie options={weakOptions} data={weakData} />
		</GraphWrapper>
	);
};

export default DashboardGraphs;

const GraphWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 1rem;
	width: 100%;
	height: 100%;
	padding-bottom: 1rem;
`;
