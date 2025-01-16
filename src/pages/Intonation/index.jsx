import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout'; // Layout 컴포넌트 가져오기

const LanguageSelection = () => {
  return (
    <Layout> {/* Layout으로 감싸기 */}
      <PageContainer>
        <Main>
          <Card className="left">
            <ImageWrapper>
              <img src="/SpeechImages/state.jpg" alt="American English" />
            </ImageWrapper>
            <CenteredText className="text">American English</CenteredText>
          </Card>
          <Card className="right">
            <ImageWrapper>
              <img src="/SpeechImages/big.jpg" alt="British English" />
            </ImageWrapper>
            <CenteredText className="text">British English</CenteredText>
          </Card>
        </Main>
      </PageContainer>
    </Layout>
  );
};

export default LanguageSelection;

// 스타일 정의
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* 화면 전체 높이 */
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 70px); /* 헤더 높이 제외 */
  overflow: hidden;
  border: 2px solid transparent; /* 투명한 테두리 추가 */

  &:hover .left:hover {
    flex-grow: 2; /* 왼쪽 카드 커짐 */
    transition: flex-grow 0.3s ease; /* 크기 변화 애니메이션 */
  }

  &:hover .right:hover {
    flex-grow: 2; /* 오른쪽 카드 커짐 */
    transition: flex-grow 0.3s ease; /* 크기 변화 애니메이션 */
  }

  &:hover .left:not(:hover),
  &:hover .right:not(:hover) {
    flex-grow: 0.8; /* 마우스 오버되지 않은 카드 축소 */
    transition: flex-grow 0.3s ease; /* 부드러운 축소 애니메이션 */
  }
`;

const Card = styled.div`
  position: relative;
  flex: 1; /* 기본 상태에서 동일 크기 */
  height: 100%;
  overflow: hidden;
  transition: flex-grow 0.3s ease; /* 부드러운 크기 변화 효과 */

  &.left {
    border-radius: 2rem 0 0 2rem; /* 왼쪽 카드의 border-radius */
  }

  &.right {
    border-radius: 0 2rem 2rem 0; /* 오른쪽 카드의 border-radius */
  }

  &:hover .text {
    opacity: 1; /* 마우스가 올라간 카드의 텍스트 유지 */
  }

  &:not(:hover) .text {
    opacity: 0; /* 마우스가 올라가지 않은 카드의 텍스트 숨기기 */
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지를 비율에 맞게 꽉 채움 */
    transition: transform 0.3s ease; /* 부드러운 확대 효과 */
  }
`;

const CenteredText = styled.div`
  position: absolute;
  top: 50%; /* 중앙 배치 */
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 3.5rem; /* 텍스트 크기 */
  font-weight: bold;
  text-shadow: 0px 0px 15px rgba(0, 0, 0, 0.7); /* 텍스트 그림자 */
  white-space: nowrap; /* 줄바꿈 금지 */
  line-height: 1.2; /* 텍스트 높이 조정 */
  transition: opacity 0.3s ease; /* 텍스트 숨김/표시 애니메이션 */
  opacity: 1;
`;