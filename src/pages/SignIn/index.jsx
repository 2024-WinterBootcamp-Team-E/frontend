import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { pretendard_bold, TextSizeL } from '@/GlobalStyle';

const SignInPage = () => {
  return (
    <Layout>
      <SignInContainer>
        <SignInForm>
          <Title>Sign In</Title>
          <Input label="Email" placeholder="Input your Email" />
          <Input label="Password" type="password" placeholder="Input your Password" />
          <Button varient="black" rounded="sm" size="full" padding="lg">
            <BoldLgText><span>Sign In</span></BoldLgText>
          </Button>
          <Divider />
          <Text>Don’t have an account?</Text>
          <SignUpButton varient="white" border="black" rounded="sm" size="full" padding="lg">
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
