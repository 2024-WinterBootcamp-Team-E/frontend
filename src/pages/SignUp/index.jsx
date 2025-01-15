import React from 'react';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import { pretendard_bold, TextSizeL } from '@/GlobalStyle';
const SignUpPage = () => {
  return (
    <Layout>
      <SignUpContainer>
        <SignUpForm>
          <Title>Sign Up</Title>
          {/* <Label htmlFor="nickname">Nickname</Label> */}
          <Input label="Nickname" placeholder="Input your Nickname" />
          <Input label="Email" placeholder="abc123@gmail.com" />
          <Input label="Password" type="password" placeholder="Input your Password" />
          <Input label="Password Check" type="password" placeholder="Check your Password" />
          <SignUpButton>Sign Up</SignUpButton>
		  <Divider />
          <Footer>
  			<Text>Have an account?</Text>
  			<SignInButton>Sign In</SignInButton> 
		  </Footer>
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
  border: 0.0625rem solid var(--neutral-40, #d8dce0); /* 1px */
  border-radius: 1rem; /* 16px */
  width: 25rem; /* 400px */
  border: 0.0625rem solid transparent; /* 1px */
  gap: 0.75rem;
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

const Label = styled.label`
  align-self: flex-start;
  font-size: 0.875rem; /* 14px */
  color: var(--neutral-100, #0a0a0a);
  margin-bottom: 0.1rem; /* 1.6px */
`;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.75rem; /* 12px */
//   border: 0.0625rem solid var(--neutral-50, #babec1); /* 1px */
//   border-radius: 0.5rem; /* 8px */
//   font-size: 1rem; /* 16px */
//   color: var(--neutral-100, #0a0a0a);
//   background-color: var(--neutral-10, #ffffff); /* 배경색을 흰색으로 설정 */
//   margin-bottom: 0.6rem; /* 9.6px */
//   &:focus {
//     border-color: var(--primary-main, #d9983e);
//     outline: none;
//   }
// `;

const SignUpButton = styled.button`
  width: 100%;
  padding: 0.875rem; /* 14px */
  background-color: var(--neutral-100, #0a0a0a);
  color: var(--neutral-10, #ffffff);
  font-size: 1.125rem; /* 18px */
  font-weight: bold;
  border: none;
  border-radius: 0.5rem; /* 8px */
  cursor: pointer;

  &:hover {
    background-color: var(--neutral-90, #3d3f40);
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  align-items: center; /* 가운데 정렬 */
  width: 100%;
  margin-top: 0.5rem; /* Sign Up 버튼과 간격 추가 */
`;

const Text = styled.span`
  font-size: 0.875rem; /* 14px */
  color: var(--neutral-100, #0a0a0a);
  text-align: center; /* 텍스트 가운데 정렬 */
  margin-bottom: 0.5rem; /* Sign In 버튼과 간격 추가 */
  ${pretendard_bold}
  ${TextSizeL}
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 0.75rem; /* 12px */
  border: 0.0625rem solid var(--neutral-50, #babec1); /* 1px */
  border-radius: 0.5rem; /* 8px */
  font-size: 1.125rem; /* 16px */
  background-color: var(--neutral-10, #ffffff);
  color: var(--neutral-100, #0a0a0a);
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: var(--neutral-20, #ebf0f4);
  }
`;
