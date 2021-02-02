import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import Nav from './components/Nav'
import TxButton from './components/TxButton'

const TopBar: React.FC = () => {
  return (
    <StyledTopBar>
      <Container size="lg">
        <StyledTopBarInner>
          <StyledTopBarLeft>
            <Logo />
          </StyledTopBarLeft>
          <Nav />
          <StyledTopBarRight>
            <TxButton />
            <AccountButton />
          </StyledTopBarRight>
        </StyledTopBarInner>
      </Container>
    </StyledTopBar>
  )
}

const StyledTopBar = styled.div`
    position: relative;
    z-index: 0;
`

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${props => props.theme.topBarSize}px;
  justify-content: space-between;
  max-width: ${props => props.theme.siteWidth}px;
  width: 100%;
  flex-wrap: wrap;
`
const StyledTopBarLeft = styled.div`
  flex: 1
           
`

const StyledTopBarRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) {
    justify-content: flex-start;
    margin-top:10px
  }
`
export default TopBar