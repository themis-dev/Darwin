import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import TokenSymbol from '../../../components/TokenSymbol';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import { getDisplayBalance } from '../../../utils/formatBalance';
import ProgressCountdowns from './ProgressCountdowns'

interface HarProps {
  rewardAllocation?: Date;
}

const Harvest: React.FC<HarProps> = ({rewardAllocation}) => {
  const { onReward } = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  const flag = new Date().getTime() < rewardAllocation.getTime()
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="BAC" />
            </CardIcon>
            <Value value={getDisplayBalance(earnings)} />
            <Label text="Survival Cash Earned" />
          </StyledCardHeader>
          {
            flag ? 
            <StyledCardActionsCountDown>
              <StyledDivItem1>Claim Reward</StyledDivItem1>
              <ProgressCountdowns
              deadline={rewardAllocation}
              description="Next Epoch"
              />
            </StyledCardActionsCountDown> :
            <StyledCardActions>
              <Button onClick={onReward} text="Claim Reward" disabled={earnings.eq(0)} />
            </StyledCardActions>
          }
          {/* <Button onClick={onReward} text="Claim Reward" disabled={earnings.eq(0)} /> */}
            {/* <StyledDivItem1>Claim Reward</StyledDivItem1>
            <ProgressCountdowns
                deadline={rewardAllocation}
                description="Next Epoch"
            /> */}
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledDivItem1 = styled.div`
  font-size: 18px;
  color: ${(props) => props.theme.color.grey[400]};
`;
const StyledDivItem2 = styled.div`
  font-size: 16px;
`;
const StyledCardActionsCountDown = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(62, 49, 31);
  border: 0px;
  border-radius: 12px;
  color: rgb(244, 220, 39);
  cursor: pointer;
  display: flex;
  font-weight: 700;
  height: 56px;
  -webkit-box-pack: center;
  justify-content: center;
  outline: none;
  padding-left: 24px;
  padding-right: 24px;
  width: 65%;
  flex-direction: column;
  font-size: 16px;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Harvest;
