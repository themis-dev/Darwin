import React from 'react';
import styled from 'styled-components';
import Card from '../../../components/Card';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { divide } from 'numeral';

interface ProgressCountdownProps {
  deadline: Date;
  description?: string;
}

const ProgressCountdowns: React.FC<ProgressCountdownProps> = ({
  deadline,
  description,
}) => {

  const countdownRenderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps;
    const h = String(days * 24 + hours);
    const m = String(minutes);
    const s = String(seconds);
    return (
      <StyledCountdown>
        {h.padStart(2, '0')}:{m.padStart(2, '0')}:{s.padStart(2, '0')}
      </StyledCountdown>
    );
  };
  return (
      <div>
        <Countdown date={deadline} renderer={countdownRenderer} />
      </div>
  );
};

const StyledCountdown = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.color.grey[400]};
  margin: 0 0 0px 0;
`;

const StyledProgressOuter = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 3px;
  background: ${(props) => props.theme.color.grey[700]};
`;

const StyledProgress = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  border-radius: 3px;
  background: ${(props) => props.theme.color.grey[100]};
`;

const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[500]};
  font-weight: 700;
  font-size: 12px;
  text-align: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[2]}px ${(props) => props.theme.spacing[4]}px;
`;

export default ProgressCountdowns;
