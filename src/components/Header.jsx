import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
import DropDown from './DropDown';
import { ChevronDown } from '@styled-icons/boxicons-regular';
import { pretendard_bold, TextSizeXL } from '@/GlobalStyle';
import Button from '@/components/Button';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background-color: transparent;
  border-bottom: 2px solid transparent;
  position: relative;
  width: 100%;
  z-index: 1000;
`;

const Logo = styled.h1`
  color: var(--neutral-100, #0a0a0a);
  position: absolute;
  left: 2rem;
  top: 1rem;
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
  gap: 0.5rem;
  position: absolute;
  right: 2rem;
  top: 1rem;
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
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  z-index: 1001;
`;

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate 초기화

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
        <Button onClick={() => navigate('/intonation')}><h3>Region</h3></Button>
        <Button onClick={() => navigate('/pronunciation')}><h3>Theme</h3></Button>
        <Button><h3>My Activity</h3></Button>
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
        <button onClick={() => navigate('/signin')}>Sign In</button>
      )}
    </HeaderContainer>
  );
};

export default Header;
