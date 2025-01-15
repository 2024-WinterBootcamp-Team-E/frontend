import React from 'react';
import styled from 'styled-components';
import ChatBubble from '@/components/ChatBubble';
import Layout from '@/components/Layout';
import RecordButton from '@/components/RecordButton';
import Button from '@/components/Button';
import {AngleLeft} from '@styled-icons/fa-solid'
import chatData from '@/mock/chatData';

const IStudyPage = () => {
  const messages = chatData.messages;
  return (
    <Layout>
      <HeaderSection>
        <Button><BackIcon /></Button>
        <h5>Richard</h5>
        <h6>(with British English)</h6>
      </HeaderSection>
      <ChatRoomSection>
        <AIProfile src = "/AIImage.jpg" alt="AI Profile"/>
        <ChattingSection>
          {messages.map((message, index) => (
            <ChatBubble key={index} message={message} />
          ))}
        </ChattingSection>
        <UserProfile src="/UserImage.png" alt="User Profile"/>
        <SoundControl>
            <input type="range" id="progress-bar" min="0" max="100" defaultValue="50" />
            <Button>🔊</Button>
        </SoundControl>
      </ChatRoomSection>
      <ControllerSection>
        <ControllerBox>
            <RecordButton>Record</RecordButton>
        </ControllerBox>
      </ControllerSection>
    </Layout>
  );
};

// Additional Components and Styles for IStudy.jsx

const HeaderSection = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem;
  height : fit-content;
  width : 100%;
  border-bottom: 1px solid var(--neutral-30);
  background-color : var(--secondary-surface);
  border-radius: 2rem;
  gap: 0.5rem;
  margin : 0 1rem;
`;

const BackIcon = styled(AngleLeft)`
  color : var(--neutral-100);
  width : 1.25rem;
  height : 1.25rem;
`;

const ChatRoomSection = styled.main`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  grid-template-rows: 1fr;
  height: 100%; /* 고정 높이 */
  width: 100%; /* 고정 너비 */
  padding: 0; /* 내부 여백 없음 */
  overflow-y: auto; /* 내용 스크롤 활성화 */
  background-color: var(--neutral-10); /* 흰색 배경 */
  margin: 1rem;
`;

const AIProfile = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 2rem 0 0 2rem;
  margin : 0;
  padding: 0;
  object-fit: cover;
  object-position: center;
`;

const ChattingSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  position : relative;
  gap: 0.5rem;
  flex-grow: 1;
  margin: 0 ;
  width: 100%;
  height: 100%;
  overflow-y: auto; /* 스크롤 활성화 */
  background-color : #A8A999
`;

const UserProfile = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 0 2rem 2rem 0;
  margin : 0;
  padding: 0;
  object-fit: cover;
  object-position: center;
`;

const ControllerSection = styled.footer`
  padding: 1rem;
  border-top: 1px solid var(--neutral-30);
  background-color : #F6F7EE;
  border-radius: 1.9rem;
  width : 100%;
  max-width : 90rem;
  height : 6.8rem;
  margin : 0 auto;
`;

const ControllerBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 1rem;
`;

// SoundControl을 position: absolute를 적용 시킨 후, ChatRoomSection 안으로 컴포넌트를 옮긴 후, Bottom이랑 Left로 위치를 조정할 것! 열심히 계산 해보기. + calc() 사용도 가능할 것임. 
// 참고로 ChatRoomSection에는 position : relative가 선언되어 있어야 함.
const SoundControl = styled.div`
  display: flex;
  align-items: center;
  position : absolute;
  bottom: -10rem; /* ChatRoomSection의 하단에 배치 */
  left: 8rem; /* 왼쪽 여백 설정 */
  input[type='range'] {
    margin-right: 0.5rem;
  }
`;

export default IStudyPage;