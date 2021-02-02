import React from 'react';
import styled from 'styled-components';

import Card from '../Card';
import CardContent from '../CardContent';
import Container from '../Container';

export interface ModalProps {
  onDismiss?: () => void;
}

const Modal: React.FC = ({ children }) => {
  return (
      <StyledModalSM>
          <Container size="sm">
              <StyledModal>
                  <Card>
                      <CardContent>{children}</CardContent>
                  </Card>
              </StyledModal>
          </Container>
      </StyledModalSM>

  );
};

const StyledModal = styled.div`
  border-radius: 12px;
  box-shadow: 24px 24px 48px -24px #3b2942;
  position: relative;
`;
const StyledModalSM = styled.div`
  width:100%;
  @media (max-width: 768px) {
   width:90%
  }
`;

export default Modal;
