// /src/api/index.jsx
const BASE_URL = 'http://localhost:8000/api/v1';

const defaultHeaders = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

/**
 * 공통 GET 요청 함수
 * @param {string} endpoint - API 엔드포인트 (BASE_URL 이후의 경로)
 * @returns {Promise<any>} - API 응답 데이터
 */
// 사용법
// 1) 유저 정보 가져오기
// const userData = await get(`/user/19`);
// console.log(userData);
// 2) 상황 문장 목록 조회
// const data = await get(`/speech/situationType/all?situation=여행`);
// console.log(data);
export const get = async (endpoint) => {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: 'GET',
			headers: defaultHeaders,
			credentials: 'include', // 필요시 쿠키 전송
		});

		if (!response.ok) {
			throw new Error(`GET 요청 실패: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('GET 요청 오류:', error);
		throw error;
	}
};

/**
 * 공통 POST 요청 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {object | FormData} data - 전송할 데이터 (JSON 객체 또는 FormData 객체)
 * @param {boolean} isFormData - 데이터가 FormData인지 여부 (기본값: false)
 * @returns {Promise<any>} - API 응답 데이터
 */
// 사용법
// 1) applicaion/json 타입
// const data = await post(`chat/${user_id}/chat`, { character_name: { characterName }, subject: { subject } });
// console.log(data);
// 2) multipart/form-data 타입
// const formData = new FormData();
// formData.append('file', selectedFile);
// const data = await post(`chat/${user_id}/${chat_id}`, formData, true);
// console.log(data);
export const post = async (endpoint, data, isFormData = false) => {
	try {
		// FormData의 경우 Content-Type 헤더를 제거
		const headers = isFormData ? {} : defaultHeaders;

		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: 'POST',
			headers,
			credentials: 'include', // 필요 시 쿠키 전송
			body: isFormData ? data : JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`POST 요청 실패: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('POST 요청 오류:', error);
		throw error;
	}
};


/**
 * 공통 PUT 요청 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {object} data - 전송할 데이터
 * @returns {Promise<any>} - API 응답 데이터
 */
// 사용법
// const data = await put(`/user/soft/${user_id}`);
// console.log(data);
export const put = async (endpoint, data) => {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: 'PUT',
			headers: defaultHeaders,
			credentials: 'include',
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`PUT 요청 실패: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('PUT 요청 오류:', error);
		throw error;
	}
};

/**
 * 공통 PATCH 요청 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {object} data - 전송할 데이터
 * @returns {Promise<any>} - API 응답 데이터
 */
// 사용법
// const data = await patch(`/users/${user_id}`, { nickname: {nickname} });
// console.log(data);
export const patch = async (endpoint, data) => {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: 'PATCH',
			headers: defaultHeaders,
			credentials: 'include',
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`PATCH 요청 실패: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('PATCH 요청 오류:', error);
		throw error;
	}
};

/**
 * 공통 DELETE 요청 함수
 * @param {string} endpoint - API 엔드포인트
 * @returns {Promise<any>} - API 응답 데이터
 */
// 사용법법
// const data = await remove(`/users/${user_id}`);
// console.log(data);
export const remove = async (endpoint) => {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: 'DELETE',
			headers: defaultHeaders,
			credentials: 'include',
		});

		if (!response.ok) {
			throw new Error(`DELETE 요청 실패: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('DELETE 요청 오류:', error);
		throw error;
	}
};

export const postWithEventSource = async (endpoint, data, isFormData = false) => {
	try {
		// 1. FormData를 POST 요청으로 서버에 전송
		const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
		const body = isFormData ? data : JSON.stringify(data);

		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: 'POST',
			headers,
			credentials: 'include', // 필요 시 쿠키 전송
			body,
		});
		console.log('발음분석 리스폰스 : ', response); // 결과가 궁금함

		if (!response.ok) {
			throw new Error(`POST 요청 실패: ${response.status}`);
		}

		// 2. SSE를 위한 EventSource 생성
		const sseEndpoint = `${BASE_URL}${endpoint}`; // SSE 연결을 위한 별도의 엔드포인트
		const eventSource = new EventSource(sseEndpoint);

		// SSE 이벤트 처리
		eventSource.onmessage = (event) => {
			console.log('SSE 메시지 수신:', event.data);
		};

		eventSource.onerror = (error) => {
			console.error('SSE 연결 오류:', error);
			eventSource.close();
		};

		return eventSource; // EventSource 객체 반환
	} catch (error) {
		console.error('POST 요청 또는 SSE 처리 오류:', error);
		throw error;
	}
};
