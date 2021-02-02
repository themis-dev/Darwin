import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">Home</StyledLink>
      <StyledLink exact activeClassName="active" to="/bank">Bank</StyledLink>
      <StyledLink exact activeClassName="active" to="/bonds">Bonds</StyledLink>
      <StyledLink exact activeClassName="active" to="/boardroom">Boardroom</StyledLink>
      {/*<StyledLink2 href="https://ht.mdex.com/#/swap" target="_blank" >Swap</StyledLink2>*/}
      <StyledLink exact activeClassName="active" to="/info">Info</StyledLink>
      <StyledLink2 href="https://basisx.medium.com/detailed-tutorial-basisx-is-huobis-first-algorithmic-stable-currency-to-anchor-usd-aeda5839e2cc" target="_blank" >Tutorial</StyledLink2>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled(NavLink)`
  color: ${props => props.theme.color.grey[400]};
  font-weight: 700;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
  &.active {
    color: ${props => props.theme.color.primary.main};
  }
  @media (max-width: 768px) {
    padding-left: ${props => props.theme.spacing[1]}px;
    padding-right: ${props => props.theme.spacing[1]}px;
  }
`
const StyledLink2 = styled.a`
  color: ${props => props.theme.color.grey[400]};
  font-weight: 700;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
  &.active {
    color: ${props => props.theme.color.primary.main};
  }
   @media (max-width: 768px) {
    padding-left: ${props => props.theme.spacing[1]}px;
    padding-right: ${props => props.theme.spacing[1]}px;
  }
`

export default Nav