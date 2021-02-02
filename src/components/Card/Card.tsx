import React from 'react'
import styled from 'styled-components'

const Card: React.FC = ({ children }) => (
  <StyledCard>
    {children}
  </StyledCard>
)

const StyledCard = styled.div`
  background-color: #3b2942;
  border: 1px solid #3b2942;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #3b2942;
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default Card
