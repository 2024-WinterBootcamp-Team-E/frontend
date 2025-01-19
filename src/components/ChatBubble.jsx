import styled from 'styled-components';
import { AngleUp, AngleDown } from '@styled-icons/fa-solid';

const ChatBubble = ({ message, isFeedbackVisible, toggleFeedback }) => {
  const { role, content, grammar_feedback } = message;

  return (
    <ChatBubbleWrapper role={role}>
      {/* 닉네임과 프로필 이미지 */}
      <ProfileImage
        src={role === 'user' ? '/UserImage.png' : '/AIImage.jpg'}
        alt={`${role} Profile`}
      />
      <BubbleWrapper role={role}>
        <ChatterName role={role}>
        {role === 'user' ? 'Nickname' : 'AIName'}
        </ChatterName>
        {/* 말풍선과 피드백 */}
        <BubbleContainer isUser={role === 'user'}>
        
        <MessageRow>
          <MessageText>{content}</MessageText>
          {role === 'user' && grammar_feedback && (
            <FeedbackToggle onClick={toggleFeedback}>
              {isFeedbackVisible ? <StyledAngleUp /> : <StyledAngleDown />}
            </FeedbackToggle>
          )}
        </MessageRow>
        {isFeedbackVisible && role === 'user' && (
          <FeedbackWrapper>
            <Separator />
            <FeedbackBox>{grammar_feedback}</FeedbackBox>
          </FeedbackWrapper>
        )}
        </BubbleContainer>
      </BubbleWrapper>
    </ChatBubbleWrapper>
  );
};

export default ChatBubble;

// Styled Components
export const ChatBubbleWrapper = styled.div`
  display: flex;
  flex-direction: ${({ role }) => (role === 'user' ? 'row-reverse' : 'row')};
  align-items: start;
  gap: 0.5rem;
  margin: 1rem 0;
  width:100%;
`;

const ProfileImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
`;

const BubbleWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:${({ role }) => (role === 'user' ? 'end' : 'start')};
  gap: 0.5rem;
`
const ChatterName = styled.span`
  font-size: 0.875rem;
  color: var(--neutral-80);
`;

const BubbleContainer = styled.div`
  background-color: var(--neutral-10);
  border-radius: 15px;
  padding: 1rem;
  position: relative;
  max-width: 25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const MessageRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: auto;
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #333;
  padding-left:0.5rem;
  text-align:start;
`;

const FeedbackWrapper = styled.div`
`

const Separator = styled.hr`
  border: 0;
  border-top: 1px solid #ddd;
  margin: 0.5rem 0;
`;

const FeedbackBox = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #333;
  text-align:start;
  max-width: 25rem;
`;

const FeedbackToggle = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
`;

const StyledAngleUp = styled(AngleUp)`
  color: #000000;
  width: 1rem;
  height: 1rem;
`;

const StyledAngleDown = styled(AngleDown)`
  color: #000000;
  width: 1rem;
  height: 1rem;
`;