import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { pretendard_bold, TextSizeL } from '@/GlobalStyle';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || '로그인 실패');
        return;
      }

      const data = await response.json();
      console.log('로그인 성공:', data);

      // 세션 스토리지에 사용자 정보 저장
      sessionStorage.setItem('userProfile', JSON.stringify(data.data));

      alert('로그인 성공! 유저 ID: ' + data.data.nickname);
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleSignUp = () => {
    navigate('/signup'); 
  };

  return (
    <Layout>
      <SignInContainer>
        <SignInForm>
          <Title>Sign In</Title>
          <Input
            label="Email"
            placeholder="Input your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Input your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          <Button
            varient="black"
            rounded="sm"
            size="full"
            padding="lg"
            onClick={handleSignIn}
          >
            <BoldLgText><span>Sign In</span></BoldLgText>
          </Button>
          <Divider />
          <Text>Don’t have an account?</Text>
          <SignUpButton
            varient="white"
            border="black"
            rounded="sm"
            size="full"
            padding="lg"
            onClick={handleSignUp} 
          >
            <BoldLgText>Sign Up</BoldLgText>
          </SignUpButton>
        </SignInForm>
      </SignInContainer>
    </Layout>
  );
};

export default SignInPage;

const SignInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 5rem);
  background-color: var(--secondary-main);
  ${pretendard_bold}
`;

const SignInForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem; /* 40px */
  width: 25rem; /* 400px */
  gap: 0.75rem;
`;

const SignUpButton = styled(Button)`
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
  margin: 0.4rem; /* 6.4px */
`;

const Title = styled.h2`
  font-size: 2.3rem; /* 28px */
  color: var(--neutral-100, #0a0a0a);
  margin-bottom: 1rem; /* 16px */
`;

const Text = styled.span`
  font-size: 0.875rem; /* 14px */
  color: var(--neutral-100, #0a0a0a);
  text-align: center; /* 텍스트 가운데 정렬 */
  ${pretendard_bold}
  ${TextSizeL}
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.875rem; /* 14px */
  margin: 0.5rem 0;
`;
