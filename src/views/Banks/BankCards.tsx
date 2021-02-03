import React from 'react';
import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { Bank } from '../../basis-cash';
import Button from '../../components/Button';
import Card from '../../components/Card';
import CardContent from '../../components/CardContent';
import CardIcon from '../../components/CardIcon';
import useBanks from '../../hooks/useBanks';
import TokenSymbol from '../../components/TokenSymbol';
import Notice from '../../components/Notice';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import useBasisCash from '../../hooks/useBasisCash';
import { OverviewData } from '../Home/types';
import { commify } from 'ethers/lib/utils';

const BankCards: React.FC = () => {
  const [banks] = useBanks();

  const basisCash = useBasisCash();
  const [{ cash, share }, setStats] = useState<OverviewData>({});
  const fetchStats = useCallback(async () => {
    const [cash, share] = await Promise.all([
      basisCash.getCashStatFromUniswap(),
      basisCash.getShareStat(),
    ]);
    setStats({ cash, share });
  }, [basisCash, setStats]);

  useEffect(() => {
    if (basisCash) {
      fetchStats().catch((err) => console.error(err.stack));
    }
  }, [basisCash]);

  const activeBanks = banks.filter((bank) => !bank.finished);
  const inactiveBanks = banks.filter((bank) => bank.finished);

  let finishedFirstRow = false;
  const inactiveRows = inactiveBanks.reduce<Bank[][]>(
    (bankRows, bank) => {
      const newBankRows = [...bankRows];
      if (newBankRows[newBankRows.length - 1].length === (finishedFirstRow ? 2 : 3)) {
        newBankRows.push([bank]);
        finishedFirstRow = true;
      } else {
        newBankRows[newBankRows.length - 1].push(bank);
      }
      return newBankRows;
    },
    [[]],
  );

  return (
    <StyledCards>
      {inactiveRows[0].length > 0 && (
        <StyledInactiveNoticeContainer>
          <Notice color="grey">
            <b>You have banks where the mining has finished.</b>
            <br />
            Please withdraw and settle your stakes.
          </Notice>
        </StyledInactiveNoticeContainer>
      )}
      <StyledRow>
        {activeBanks.map((bank, i) => (
          <React.Fragment key={bank.name}>
            <BankCard bank={bank} cash={cash} share={share}/>
            {i < activeBanks.length - 1}
          </React.Fragment>
        ))}
      </StyledRow>
      {inactiveRows[0].length > 0 && (
        <>
          <StyledInactiveBankTitle>Inactive Banks</StyledInactiveBankTitle>
          {inactiveRows.map((bankRow, i) => (
            <StyledRow key={i}>
              {bankRow.map((bank, j) => (
                <React.Fragment key={j}>
                  <BankCard bank={bank} />
                  {j < bankRow.length - 1}
                </React.Fragment>
              ))}
            </StyledRow>
          ))}
        </>
      )}
    </StyledCards>
  );
};


interface BankCardProps {
  bank: Bank;
  cash?: any,
  share?: any,
}

const BankCard: React.FC<BankCardProps> = ({ bank, cash, share }) => {
  return (
    <StyledCardWrapper>
      {bank.depositTokenName.includes('LP') &&
        (bank.depositTokenName.includes('BXC_USDT(HECO)-LP') ? (
          <StyledCardSuperAccent />
        ) : (
          <StyledCardAccent />
        ))}
      <Card>
        <CardContent>
          <StyledContent>
            <CardIcon>
              <TokenSymbol symbol={bank.depositTokenName} size={54} />
            </CardIcon>
            <StyledTitle>{bank.name}</StyledTitle>
            <StyledDetails>
              <StyledDetail>Deposit {bank.depositTokenName.toUpperCase()}</StyledDetail>
              <StyledDetail>Earn {`${bank.earnTokenName}`}</StyledDetail>
            </StyledDetails>
            <StyledTotal>
              <Styledline></Styledline>
              <StyledTotalContent>
                <StyledTotalItem>
                  <StyledAPY>TVL</StyledAPY>
                  <StyledAPY>${commify(bank.totalNum?.tvl)}</StyledAPY>
                </StyledTotalItem>
                <StyledTotalItem>
                  <StyledAPY>APY</StyledAPY>
                  {
                    bank.depositTokenName.toUpperCase() === 'BXC_USDT(HECO)-LP' ||  bank.depositTokenName.toUpperCase() === 'BXS_USDT(HECO)-LP' ?
                    <StyledAPY>{share ? (bank.totalNum?.apy * share?.priceInDAI).toFixed(2) + '%': '— %'}</StyledAPY> :
                    <StyledAPY>{cash ? (bank.totalNum?.apy * cash?.priceInDAI).toFixed(2) + '%': '— %'}</StyledAPY>
                  }
                </StyledTotalItem>
              </StyledTotalContent>
            </StyledTotal>
            <Button text="Select" to={`/bank/${bank.contract}`} />
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  );
};

const StyledTotal = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 88%;
`;

const StyledTotalContent = styled.div`

`;

const StyledTotalItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledAPY = styled.div`
  color: #fff;
  font-size: 14px;
  margin-top: 10px
`;
const Styledline = styled.div`
  background: #fff;
  width: 100%;
  height: 1px;
`;

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  border-radius: 12px;
  filter: blur(4px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const StyledCardSuperAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  border-radius: 12px;
  filter: blur(8px);
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  z-index: -1;
`;

const StyledCards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1000px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
  margin-bottom: 20px;
  margin-left: 30px
`;

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
  @media (min-width: 768px) {
    min-height: 125px;
    display: flex;
    align-items: center;
  }
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDetails = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`;

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[300]};
`;

const StyledInactiveNoticeContainer = styled.div`
  width: 598px;
  margin-bottom: ${(props) => props.theme.spacing[6]}px;
`;

const StyledInactiveBankTitle = styled.p`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.color.grey[400]};
  margin-top: ${(props) => props.theme.spacing[5]}px;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`;

export default BankCards;
