import React from 'react';
import styled from 'styled-components';
// README에서 안내된 'named import'
import { ContributionCalendar } from 'react-contribution-calendar';

const Attendance = ({ contributions = {} }) => {
  // data 변환
  const data = Object.entries(contributions).map(([date, count]) => ({
    [date]: { level: Math.min(count, 2) },
  }));

const today = new Date();
const endDate = today.toISOString().split('T')[0];
const startTmp = new Date(today);
today.setDate(startTmp.getDate() - 365);
const startDate = today.toISOString().split('T')[0];

  return (
    <StyledWrapper>
      <ContributionCalendar
        data={data}
        start={startDate}
        end={endDate}
        daysOfTheWeek={['', 'Mon', '', 'Wed', '', 'Fri', '']}
        startsOnSunday={true}   // 주 시작 요일을 일요일로 할 경우 true
        includeBoundary={true}
        theme='coral'  
        textColor="#1F2328"
        // 원의 (cx, cy) 위치, 반지름(cr) => cr이 커지면 원이 커져서 세로가 늘어남
        cx={14}
        cy={14}
        cr={2}

        style={{
          margin: '0 auto',  
          display: 'block',
          fontWeight: 500, 
        }}

        scroll={false}
        hideDescription={false}
        hideMonthLabels={false}
        hideDayLabels={false}
        onCellClick={(e, cellData) => console.log('CellData:', cellData)}
      />
    </StyledWrapper>
  );
};

export default Attendance;

const StyledWrapper = styled.div`
  width: 100%;
  padding: 1rem; 
  overflow: visible;
`
