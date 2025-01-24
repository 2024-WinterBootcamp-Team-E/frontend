import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { pretendard_bold, TextSizeL } from '@/GlobalStyle';
import { post } from '@/api';

const SignUpPage = () => {
	const navigate = useNavigate(); // navigate 함수 선언

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		resetField,
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const onSubmit = async (data) => {
		// passwordCheck 필드를 제외한 데이터 추출
		const { passwordCheck, ...filteredData } = data;

		try {
			// 공통 post 함수를 사용해 회원가입 요청 보내기
			const result = await post('/user/signup', filteredData);
			console.log('Signup successful:', result);
			alert('회원가입 성공!');

			// 폼 필드 초기화
			resetField('nickname');
			resetField('email');
			resetField('password');
			resetField('passwordCheck');
			// 회원가입이 완료되면 /signin 페이지로 이동
			navigate('/signin');
		} catch (error) {
			console.error('Request failed:', error);
			alert('네트워크 오류로 회원가입에 실패했습니다.');
		}
	};
	return (
		<Layout>
			<SignUpContainer>
				<SignUpForm onSubmit={handleSubmit(onSubmit)}>
					<Title>Sign Up</Title>

					{/* Nickname */}
					<Input
						label='Nickname'
						placeholder='Input your Nickname'
						message={errors.nickname?.message} // errors.nickname의 메시지 전달
						state={errors.nickname ? 'danger' : 'default'} // 상태에 따라 danger 스타일 적용
						{...register('nickname', {
							required: '닉네임을 입력해주세요.',
							validate: (value) => !/\s/.test(value) || '닉네임에 공백을 제거해주세요.',
						})}
					/>

					{/* Email */}
					<Input
						label='Email'
						placeholder='abc123@gmail.com'
						message={errors.email?.message}
						state={errors.email ? 'danger' : 'default'}
						{...register('email', {
							required: '이메일을 입력해주세요.',
							pattern: {
								value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
								message: '유효한 이메일 주소를 입력해주세요.',
							},
						})}
					/>

					{/* Password */}
					<Input
						label='Password'
						type='password'
						placeholder='Input your Password'
						message={errors.password?.message}
						state={errors.password ? 'danger' : 'default'}
						{...register('password', {
							required: '비밀번호를 입력해주세요.',
							minLength: {
								value: 6,
								message: '비밀번호는 최소 6자리 이상이어야 합니다.',
							},
						})}
					/>

					{/* Password Check */}
					<Input
						label='Password Check'
						type='password'
						placeholder='Check your Password'
						message={errors.passwordCheck?.message}
						state={errors.passwordCheck ? 'danger' : 'default'}
						{...register('passwordCheck', {
							required: '비밀번호 확인을 입력해주세요.',
							validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.',
						})}
					/>

					<Button varient='black' rounded='sm' size='full' padding='lg' type='submit'>
						<BoldLgText>
							<span>Sign Up</span>
						</BoldLgText>
					</Button>
				</SignUpForm>
			</SignUpContainer>
		</Layout>
	);
};

export default SignUpPage;

// Styled Components
const SignUpContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-color: var(--secondary-main);
	${pretendard_bold}
`;

const SignUpForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2.5rem;
	width: 25rem;
	gap: 0.75rem;
`;

const SignInButton = styled(Button)`
	border: 1px solid var(--neutral-100);
`;

const BoldLgText = styled.p`
	${pretendard_bold}
	${TextSizeL}
  span {
		color: var(--neutral-10);
	}
`;

const Divider = styled.hr`
	width: 100%;
	background-color: var(--neutral-50, #0a0a0a);
	margin: 0.4rem;
`;

const Title = styled.h2`
	font-size: 2.3rem;
	color: var(--neutral-100, #0a0a0a);
	margin-bottom: 1rem;
`;

const Text = styled.span`
	font-size: 0.875rem;
	color: var(--neutral-100, #0a0a0a);
	text-align: center;
	${pretendard_bold}
	${TextSizeL}
`;

const ErrorMessage = styled.p`
	color: red;
	font-size: 0.875rem;
	margin-top: -0.5rem;
	margin-bottom: 0.5rem;
`;