import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { pretendard_bold, TextSizeL } from '@/GlobalStyle';

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    resetField,
  } = useForm({
    mode: 'onChange', // onChange로 실시간 유효성 검사
    reValidateMode: 'onChange',
  });

  const onSubmit = (data) => {
    console.log("Form submitted successfully:", data);

    // 모든 값이 유효한 경우에만 처리
    if (isValid) {
      alert("Signup successful!");
      resetField('nickname');
      resetField('email');
      resetField('password');
      resetField('passwordCheck');
    }
  };

  return (
    <Layout>
      <SignUpContainer>
        <SignUpForm onSubmit={handleSubmit(onSubmit)}>
          <Title>Sign Up</Title>

          {/* Nickname */}
          <Input
            label="Nickname"
            placeholder="Input your Nickname"
            {...register('nickname', {
              required: '닉네임을 입력해주세요.',
              validate: (value) =>
                !/\s/.test(value) || '닉네임에 공백을 제거해주세요.',
            })}
          />
          {errors.nickname && (
            <ErrorMessage>{errors.nickname.message}</ErrorMessage>
          )}

          {/* Email */}
          <Input
            label="Email"
            placeholder="abc123@gmail.com"
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: '유효한 이메일 주소를 입력해주세요.',
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          {/* Password */}
          <Input
            label="Password"
            type="password"
            placeholder="Input your Password"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자리 이상이어야 합니다.',
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}

          {/* Password Check */}
          <Input
            label="Password Check"
            type="password"
            placeholder="Check your Password"
            {...register('passwordCheck', {
              required: '비밀번호 확인을 입력해주세요.',
              validate: (value) =>
                value === watch('password') || '비밀번호가 일치하지 않습니다.',
            })}
          />
          {errors.passwordCheck && (
            <ErrorMessage>{errors.passwordCheck.message}</ErrorMessage>
          )}

          <Button varient="black" rounded="sm" size="full" padding="lg" type="submit">
            <BoldLgText>
              <span>Sign Up</span>
            </BoldLgText>
          </Button>

          <Divider />
          <Text>Have an account?</Text>
          <SignInButton varient="white" border="black" rounded="sm" size="full" padding="lg">
            <BoldLgText>Sign In</BoldLgText>
          </SignInButton>
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
  height: calc(100vh - 5rem);
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