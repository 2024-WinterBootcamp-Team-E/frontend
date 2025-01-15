import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DropDown from './DropDown'; // DropDown 컴포넌트 가져오기
import { ChevronDown } from '@styled-icons/boxicons-regular';
import { pretendard_bold, TextSizeXL } from '@/GlobalStyle';
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background-color: transparent;
  border-bottom: 2px solid transparent;
  position: relative; /* HeaderContainer에 relative 추가 */
  width: 100%;
  z-index: 1000;
`;

const Logo = styled.h1`
  color: var(--neutral-100, #0a0a0a);
  position: absolute; /* absolute로 변경 */
  left: 2rem; /* padding-left:2rem */
  top: 1rem; /* padding-top: 1rem; */
`;

const Nav = styled.div`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  h3 {
    cursor: pointer;
    color: var(--neutral-100);
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 아이템 간 간격 */
  position: absolute; /* absolute로 변경 */
  right: 2rem; /* HeaderContainer의 오른쪽 기준 위치 설정 */
  top: 1rem; /* 수직 중앙 정렬 */
`;

const ProfileImage = styled.img`
  width: 2.5em;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;

`;

const ProfileName = styled.span`
  ${TextSizeXL}
  ${pretendard_bold}
  color: var(--neutral-100);
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const ChevronIcon = styled(ChevronDown)`
  width: 1.5rem;
  height: 1.5rem;
  color: black;
`;

const StyledDropDownWrapper = styled.div`
  position: absolute;
  top: 100%; /* 프로필 아래에 드롭다운 표시 */
  right: 0;
  margin-top: 0.5rem;
  z-index: 1001;
`;

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false); // 드롭다운 상태

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const mockApiResponse = {
          isLoggedIn: true,
          profile: {
            image: 'UserImage.png',
            name: 'TaciTa',
          },
        };

        if (mockApiResponse.isLoggedIn) {
          setIsLoggedIn(true);
          setProfile(mockApiResponse.profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <HeaderContainer>
      <Logo>Logo</Logo>
      <Nav>
          <h3>Region</h3>
          <h3>Theme</h3>
          <h3>My Activity</h3>
      </Nav>
      {isLoggedIn && profile ? (
        <ProfileContainer>
          <ProfileImage src={profile.image} alt="Profile" />
          <ProfileName>{profile.name}</ProfileName>
          <DropdownButton onClick={() => setIsDropDownOpen((prev) => !prev)}>
            <ChevronIcon />
          </DropdownButton>
          {isDropDownOpen && (
            <StyledDropDownWrapper>
              <DropDown isDropDownOpen={isDropDownOpen} />
            </StyledDropDownWrapper>
          )}
        </ProfileContainer>
      ) : (
        <button>Sign In</button>
      )}
    </HeaderContainer>
  );
};

export default Header;