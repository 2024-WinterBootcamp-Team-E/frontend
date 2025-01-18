import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatBubble from '@/components/ChatBubble';
import Layout from '@/components/Layout';
import RecordButton from '@/components/RecordButton';
import { AngleLeft } from '@styled-icons/fa-solid';
import { ToggleOff, ToggleOn } from '@styled-icons/fa-solid';
import chatData from '@/mock/chatData';

const IStudy = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // 사이드바 상태
  const [selectedChat, setSelectedChat] = useState(null); // 초기 상태 추가
  const messages = chatData.messages;
  const chatContentRef = useRef(null); // 채팅창 참조
  const [feedbackVisibility, setFeedbackVisibility] = useState({});

  const chat_history = [
    {
      subject: '호텔직원과 대화하는상황',
      create_at: '2025.01.11',
      updated_at: '2025.01.18',
    },
    {
      subject: '길을 물어보는 상황',
      create_at: '2025.01.12',
      updated_at: '2025.01.18',
    },
    {
      subject: '음식을 주문하는 상황',
      create_at: '2025.01.18',
      updated_at: '2025.01.18',
    },
  ];
  
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleFeedback = (index) => {
    setFeedbackVisibility((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // 특정 메시지의 피드백 토글
    }));
  };

  useEffect(() => {
    // 초기 상태 설정: 첫 번째 항목을 기본 선택
    if (!selectedChat && chat_history.length > 0) {
      setSelectedChat(chat_history[0]);
    }

    // 새로운 메시지가 추가될 때마다 스크롤이 아래로 이동
    chatContentRef.current?.scrollTo({
      top: chatContentRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, selectedChat, chat_history]);

  return (
    <Layout>
      <MainContainer expanded={isSidebarExpanded}>
        {/* 왼쪽 사이드바 */}
        <Sidebar expanded={isSidebarExpanded}>
          {isSidebarExpanded ? (
            <>
              <SidebarHeader>
                <h5>Chat List</h5>
                <ToggleWrapper onClick={toggleSidebar}>
                  <StyledToggleOff />
                </ToggleWrapper>
              </SidebarHeader>
              <StyledHr/>
              <SubjectList>
                {chat_history.map((history, index) => (
                  <SubjectItem
                    key={index}
                    onClick={() => setSelectedChat(history)} // 클릭 시 선택된 채팅 데이터 업데이트
                  >
                    <span role="img" aria-label="flag">
                      🇺🇸
                    </span>
                    <SubjectText>{history.subject}</SubjectText>
                    <DateDisplay>{history.updated_at}</DateDisplay>
                  </SubjectItem>
                ))}
              </SubjectList>
            </>
          ) : (
            <ToggleWrapper onClick={toggleSidebar}>
              <StyledToggleOn />
            </ToggleWrapper>
          )}
        </Sidebar>

        {/* 채팅 영역 */}
        <ChatSection>
          <ChatHeader>
            <AngleLeftIcon />
            <ChatTitle>
              <TitleLarge>{selectedChat?.subject || 'Subject1'}</TitleLarge>
                  <TitleSmall>
                    {selectedChat
                      ? `${selectedChat.create_at} ~ ${selectedChat.updated_at}`
                      : 'yyyy.mm.dd ~ yyyy.mm.dd'}
                  </TitleSmall>
            </ChatTitle>
          </ChatHeader>
          <StyledHr/>
          <ChatContent ref={chatContentRef}>
          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              message={message}
              isFeedbackVisible={feedbackVisibility[index] || false}
              toggleFeedback={() => toggleFeedback(index)}
            />
          ))}
        </ChatContent>
          <RecordSection>
            <RecordButton where='istudy' />
          </RecordSection>
        </ChatSection>
      </MainContainer>
    </Layout>
  );
};

// Styled Components
const MainContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => (props.expanded ? '20% 80%' : '5% 95%')};
  grid-gap: 1rem;
  background-color: var(--neutral-10);
  transition: grid-template-columns 0.3s ease;
`;

const Sidebar = styled.aside`
	background-color: #d4d5c8;
	padding: ${(props) => (props.expanded ? '1rem' : '0.5rem')};
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	overflow: auto;
	height: 100%;
	transition:
		width 0.3s ease,
		padding 0.3s ease;
	position: relative;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  margin: 0;
  padding: 0;

  h5 {
  padding-left:0.5rem;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
`;

const StyledToggleOn = styled(ToggleOn)`
  color: var(--neutral-100);
  width: 2rem;
  height: 2rem;
  margin-top:2.4rem;
  margin-left:0.5rem;
`;

const StyledToggleOff = styled(ToggleOff)`
  color: var(--neutral-100);
  width: 2rem;
  height: 2rem;
`;

const StyledHr = styled.hr`
  margin:0;
  padding:0;
`

const SubjectList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  padding-top:1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SubjectItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--neutral-10);
  border-radius: 0.5rem;
  cursor: pointer;
`;

const SubjectText = styled.span`
  flex-grow: 1;
  margin: 0 0.5rem; /* 텍스트의 좌우 간격 */
  font-size: 1rem;
  color: #333; /* 기본 텍스트 색상 */
  overflow: hidden; /* 내용이 길어질 경우 숨김 처리 */
  text-overflow: ellipsis; /* 생략 기호 추가 */
  white-space: nowrap; /* 한 줄로 표시 */
`;

const DateDisplay = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

const ChatSection = styled.section`
	display: flex;
	flex-direction: column;
	background-color: #e0e0d5;
	padding: 1rem;
	border-radius: 1rem;
	overflow: auto;
	width: 100%;
	height: 100%;
`;

const ChatHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 아이콘과 제목 사이 간격 추가 */
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--neutral-30);
  height:4rem;
`;

const DateRange = styled.span`
  font-size: 0.875rem;
  color: var(--neutral-70);
`;

const AngleLeftIcon = styled(AngleLeft)`
  color: var(--neutral-100);
  width: 1.25rem;
  height: 1.25rem;
`;

const ChatTitle = styled.h4`
  margin: 0;
  font-size: 1.25rem; /* 적절한 크기로 설정 */
  color: var(--neutral-100); /* 텍스트 색상 */
  display: flex;
  white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 설정 */
  overflow: hidden; /* 텍스트가 길면 숨김 처리 */
  gap: 0.5rem;
`;

const TitleLarge = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--neutral-100);
`;

const TitleSmall = styled.span`
  font-size: 0.875rem;
  color: var(--neutral-70);
`;

const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 1rem;
`;

const RecordSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

export default IStudy;