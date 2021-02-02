import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href= {buyBAS} target="_blank">Get BXS</StyledLink>
      <StyledLink href= {buyBAC} target="_blank">Get BXC</StyledLink>
      <StyledLink href="https://docs.basisx.io" target="_blank">Docs</StyledLink>
      <StyledLink href="https://github.com/basisx-io/contracts/blob/main/README.md" target="_blank">GitHub</StyledLink>
      <StyledLink href="https://twitter.com/x_basis" target="_blank">Twitter</StyledLink>
      <StyledLink href="https://t.me/BasisxOfficial" target="_blank">Telegram</StyledLink>
      {/* <StyledLink href="https://discord.gg/UEZq3HF5Eu" target="_blank">Discord</StyledLink> */}
      <StyledLink href="https://basisx.medium.com/" target="_blank">Medium</StyledLink>
      <StyledLink href="https://github.com/basisx-io/contracts/blob/main/REP-BasisX-16_01_2021.pdf" target="_blank">Audit</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.grey[400]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  },
  display:inline-block;
  margin-bottom:10px;
  @media (max-width: 768px) {
    padding-left: ${props => props.theme.spacing[2]}px;
    padding-right: ${props => props.theme.spacing[2]}px;
    font-size: 10px
  }
`
const buyBAS ="https://ht.mdex.com/#/swap?outputCurrency=0xbe0e001A5553f4421DC250A20bBdAb0e735495e3&inputCurrency=0xa71edc38d189767582c38a3145b5873052c3e47a";
const buyBAC= "https://ht.mdex.com/#/swap?outputCurrency=0x15F4c382926F8A083bC924AbD3aa84Ce3982CAa9&inputCurrency=0xa71edc38d189767582c38a3145b5873052c3e47a"
export default Nav
