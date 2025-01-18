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
 * @param {object} data - 전송할 데이터
 * @returns {Promise<any>} - API 응답 데이터
 */
export const post = async (endpoint, data) => {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: 'POST',
			headers: defaultHeaders,
			credentials: 'include',
			body: JSON.stringify(data),
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
