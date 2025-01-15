import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { pretendard_bold, TextSizeL } from '@/GlobalStyle';

const SignUpPage = () => {
  return (
    <Layout>
      <SignUpContainer>
        <SignUpForm>
          <Title>Sign Up</Title>
          <Input label="Nickname" placeholder="Input your Nickname" />
          <Input label="Email" placeholder="abc123@gmail.com" />
          <Input label="Password" type="password" placeholder="Input your Password" />
          <Input label="Password Check" type="password" placeholder="Check your Password" />
          <Button varient="black" rounded="sm" size="full" padding="lg"><BoldLgText><span>Sign Up</span></BoldLgText></Button>
          <Divider />
          <Text>Have an account?</Text>
          <SignInButton varient="white" border="black" rounded="sm" size="full" padding="lg"><BoldLgText>Sign In</BoldLgText></SignInButton>
        </SignUpForm>
      </SignUpContainer>
    </Layout>
  );
};

export default SignUpPage;

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 5rem);
  background-color: var(--secondary-main);
  ${pretendard_bold}
`;

const SignUpForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem; /* 40px */
  width: 25rem; /* 400px */
  gap: 0.75rem; // <- 간격!
`;

const SignInButton = styled(Button)`
  border: 1px solid var(--neutral-100);
`
const BoldLgText = styled.p`
  ${pretendard_bold}
  ${TextSizeL}
  span {
    color: var(--neutral-10);
  }
`

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

const Footer = styled.div`
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  align-items: center; /* 가운데 정렬 */
  width: 100%;
  margin-top: 0rem; /* Sign Up 버튼과 간격 추가 */
`;

const Text = styled.span`
  font-size: 0.875rem; /* 14px */
  color: var(--neutral-100, #0a0a0a);
  text-align: center; /* 텍스트 가운데 정렬 */
  ${pretendard_bold}
  ${TextSizeL}
`;

