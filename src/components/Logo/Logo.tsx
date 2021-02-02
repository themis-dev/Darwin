import React from 'react';
import styled from 'styled-components';

import farmer from '../../assets/img/farmer.svg';

const Logo: React.FC = () => {
  return (
    <StyledLogo>
      <img src={farmer} height="42" />
      <StyledLink href="/">Darwin</StyledLink>
    </StyledLogo>
  );
};

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    margin-bottom:10px
  }
`;

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[100]};
  text-decoration: none;
  font-size: 18px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing[2]}px;
   
`;

export default Logo;
