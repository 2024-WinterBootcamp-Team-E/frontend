import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { pretendard_bold } from '@/GlobalStyle';

const PronunciationPage = () => {
  const categories = [
    { name: 'Travel', image: '/PronunImages/travel.jpg' },
    { name: 'Movie', image: '/PronunImages/movie.jpg' },
    { name: 'Business', image: '/PronunImages/business.jpg' },
    { name: 'Practical', image: '/PronunImages/practical.jpg' },
  ];

  return (
    <Layout>
      <PageContainer>
        <CardGrid>
          {categories.map((category) => (
            <Card key={category.name}>
              <img src={category.image} alt={category.name} />
              <Overlay>
                <CategoryName>{category.name}</CategoryName>
              </Overlay>
            </Card>
          ))}
        </CardGrid>
      </PageContainer>
    </Layout>
  );
};

export default PronunciationPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100vh - 5rem);
  padding: 1rem;
  margin: 0;
  ${pretendard_bold}
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2열 레이아웃 */
  grid-template-rows: repeat(2, 1fr); /* 2행 레이아웃 */
  width: 100%; /* 화면 너비 꽉 채우기 */
  height: 100%; /* 화면 높이 꽉 채우기 */
  gap: 1rem; /* 카드 간 간격 제거 */
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 1rem; /* 모서리 둥글게 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 카드 그림자 추가 */
  background-color: #f8f9fa; /* 배경색 추가 (로딩 중 대비) */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지를 박스에 맞게 조정 */
    border-radius: 1rem; /* 이미지도 모서리 둥글게 */
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; /* 텍스트 색상 */
  font-size: 3.0rem; /* 텍스트 크기 */
  font-weight: bold;
  text-align: center;
  border-radius: 1rem; /* 오버레이도 둥글게 */
`;

const CategoryName = styled.div`
  z-index: 1;
`;