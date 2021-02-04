import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { Switch } from 'react-router-dom';
import Page from '../../components/Page';
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useBoardroomCountdown from '../../hooks/useBoardroomCountdown';

import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import Stat from './components/Stat';
import ProgressCountdown from './components/ProgressCountdown';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAmount from '../../hooks/useTreasuryAmount';
import Humanize from 'humanize-plus';
import { getBalance } from '../../utils/formatBalance';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import Notice from '../../components/Notice';
import useBoardroomVersion from '../../hooks/useBoardroomVersion';
import moment from 'moment';
import join from '../../assets/img/join.png'
import percentage from '../../assets/img/percentage.png'
import bxslogo from '../../assets/img/basis-cash-logo.png'
import useBasisCash from '../../hooks/useBasisCash';
import { OverviewData } from './types';
import axios from 'ts-axios-new'
import { apiUrl } from '../../basis-cash/config';
import { commify } from 'ethers/lib/utils';
import ProgressCountdowns from './components/ProgressCountdowns'

const Boardroom: React.FC = () => {
  // useEffect(() => window.scrollTo(0, 0));
  const basisCash = useBasisCash();
  const instance = axios.create();

  const { account } = useWallet();
  const { onRedeem } = useRedeemOnBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const {rewardAllocation, withdrawAllocation, dropoutAllocation} = useBoardroomCountdown(account)

  const cashStat = useCashPriceInEstimatedTWAP();
  const treasuryAmount = useTreasuryAmount();
  const scalingFactor = useMemo(
    () => (cashStat ? Number(cashStat.priceInDAI).toFixed(2) : null),
    [cashStat],
  );
  const { prevAllocation, nextAllocation } = useTreasuryAllocationTimes();

  const prevEpoch = useMemo(
    () =>
      nextAllocation.getTime() <= Date.now()
        ? moment().utc().startOf('day').toDate()
        : prevAllocation,
    [prevAllocation, nextAllocation],
  );

  const nextEpoch = useMemo(() => moment(prevEpoch).add(6, 'hours').toDate(), [prevEpoch]);


  const [{ cash, share, bxsStaked, apy }, setStats] = useState<OverviewData>({});
    const fetchStats = useCallback(async () => {
        const [cash, share] = await Promise.all([
        basisCash.getCashStatFromUniswap(),
        basisCash.getShareStat(),
        ]);
        const data = await instance.get(apiUrl + '/num')
        const bxsStaked = data.data.data[1].boardroom
        // console.log(cash)
        // console.log(share)
        // console.log(bxsStaked)
        const cprice = Number(cash?.priceInDAI) 
        const ctotalSupply = Number(cash?.totalSupply)
        const sprice = Number(share?.priceInDAI) 
        const qn = (1 - Math.pow(1.04, 4)) / (1 - 1.04)
        const apy =  cprice * ctotalSupply * 0.04 * qn / sprice / bxsStaked * 365 * 100
        // console.log(apy)
        // const ss = basisCash.getTreasuryCountdown(account)
        setStats({ cash, share, bxsStaked, apy });
    }, [basisCash, setStats]);

    useEffect(() => {
      if (basisCash) {
        fetchStats().catch((err) => console.error(err.stack));
      }
    }, [basisCash]);

  const boardroomVersion = useBoardroomVersion();
  const usingOldBoardroom = boardroomVersion !== 'latest';
  const migrateNotice = useMemo(() => {
    if (boardroomVersion === 'v2') {
      return (
        <StyledNoticeWrapper>
          <Notice color="green">
            <b>Please Migrate into New Boardroom</b>
            <br />
            The boardroom upgrade was successful. Please settle and withdraw your stake from the
            legacy boardroom, then stake again on the new boardroom contract{' '}
            <b>to continue earning BAC seigniorage.</b>
          </Notice>
        </StyledNoticeWrapper>
      );
    }
    return <></>;
  }, [boardroomVersion]);

  const isLaunched = Date.now() >= config.boardroomLaunchesAt.getTime();
  const flagTime = new Date().getTime() < dropoutAllocation.getTime()
  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            icon={join}
            title="Join Reactive Evolution Boardroom"
            subtitle="Stake SUVS for Mutant Inflationary Rewards"
            subtitle1="Max Inflation 4% per Epoch"
            boardoom={true}
          />
          <LaunchCountdown
            deadline={config.boardroomLaunchesAt}
            description=""
            descriptionLink=""
          />
          <StyledBoardroomTip>
            <StyledBoardroomTipItem>
              1. Each Epoch time is 6 hours. The new SUVC is allocated according to the proportion of SUVS pledge in Boardroom.
            </StyledBoardroomTipItem>
            <StyledBoardroomTipItem>
              2. Each time a SUVS pledger claims SUVC rewards, it will lock up for 4 epochs before the new SUVC rewards can be claimed.
            </StyledBoardroomTipItem>
            <StyledBoardroomTipItem>
              3. Each time a SUVS pledger stakes or unstakes SUVS, it will lock up for 6 epochs before the remaining SUVS can be unstaked. However, SUVS can be staked at any time.
            </StyledBoardroomTipItem>
          </StyledBoardroomTip>
        </Page>
      </Switch>
    );
  }

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <PageHeader
              icon={join}
              title="Join Reactive Evolution Boardroom"
              subtitle="Stake SUVS for Mutant Inflationary Rewards"
              subtitle1="Max Inflation 4% per Epoch"
              boardoom={true}
            />
            {migrateNotice}
            <StyledHeader>
              <ProgressCountdown
                base={prevEpoch}
                deadline={nextEpoch}
                description="Next Epoch"
              />
              <Stat
                icon="💵"
                title={cashStat ? `$${cashStat.priceInDAI}` : '-'}
                description="SUVC Price (TWAP)"
              />
              <Stat
                icon="🚀"
                // title={scalingFactor ? `x${scalingFactor}` : '-'}
                title={'x1.04'}
                description="Scaling Factor"
              />
            </StyledHeader>
            <StyledHeader1>
              <Stat
                icon="💰"
                title={
                  treasuryAmount
                    ? `~$${Humanize.compactInteger(getBalance(treasuryAmount), 2)}`
                    : '-'
                }
                description="Treasury Amount"
              />
              <StyledApyDiv>
                <StyledCardImg src={percentage} />
                <StyledTextWrapper>
                  <StyledCardTitle>{apy ? (String(apy.toFixed(2))) + '%': '-'}</StyledCardTitle>
                  <StyledDesc>APY</StyledDesc>
                </StyledTextWrapper>
              </StyledApyDiv>
              <StyledApyDiv>
                <StyledCardImg src={bxslogo} />
                <StyledTotalContent>
                <StyledTotalItem>
                  <StyledAPY>{bxsStaked ? bxsStaked: '-'}</StyledAPY>
                  <StyledAPY1>SUVS staked</StyledAPY1>
                </StyledTotalItem>
                <StyledTotalItem>
                  <StyledAPY>${commify(share ? String((bxsStaked * Number(share?.priceInDAI)).toFixed(2)): '')}</StyledAPY>
                  <StyledAPY1>TVL</StyledAPY1>
                </StyledTotalItem>
              </StyledTotalContent>
              </StyledApyDiv>
            </StyledHeader1>
            <StyledBoardroom>
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <Harvest rewardAllocation={rewardAllocation}/>
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Stake withdrawAllocation={withdrawAllocation}/>
                </StyledCardWrapper>
              </StyledCardsWrapper>
              <Spacer size="lg" />
              {!usingOldBoardroom && (
                // for old boardroom users, the button is displayed in Stake component
                <>
                  <div>
                    {
                      Number(stakedBalance) > 0 ?
                      flagTime ?
                      <StyledCardActionsCountDown>
                        <StyledDivItem1>Settle & Withdraw</StyledDivItem1>
                        <ProgressCountdowns
                        deadline={dropoutAllocation}
                        />
                      </StyledCardActionsCountDown>:
                      <Button
                        disabled={stakedBalance.eq(0)}
                        onClick={onRedeem}
                        text="Settle & Withdraw"
                      /> : 
                      null
                    }
                  </div>
                  <Spacer size="lg" />
                </>
              )}
              <StyledBoardroomTip>
            <StyledBoardroomTipItem>
              1. Each Epoch time is 6 hours. The new SUVC is allocated according to the proportion of SUVS pledge in Boardroom.
            </StyledBoardroomTipItem>
            <StyledBoardroomTipItem>
              2. Each time a SUVS pledger claims SUVC rewards, it will lock up for 4 epochs before the new SUVC rewards can be claimed.
            </StyledBoardroomTipItem>
            <StyledBoardroomTipItem>
              3. Each time a SUVS pledger stakes or unstakes SUVS, it will lock up for 6 epochs before the remaining SUVS can be unstaked. However, SUVS can be staked at any time.
            </StyledBoardroomTipItem>
          </StyledBoardroomTip>
            </StyledBoardroom>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};


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
  height: 60px;
  -webkit-box-pack: center;
  justify-content: center;
  outline: none;
  padding-left: 24px;
  padding-right: 24px;
  width: 80%;
  flex-direction: column;
  font-size: 16px;
`;

const StyledTotal = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 88%;
`;

const StyledTotalContent = styled.div`
  width: 85%;
  padding: 0px 0px 0px 0px;
`;

const StyledTotalItem = styled.div`
  display: flex;
  align-items: flex-end;
  line-height: 1;
`;

const StyledAPY = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin-top: 10px;
  // @media (max-width: 768px) {
  //   font-size: 14px;
  // }
`;

const StyledAPY1 = styled.div`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 14px;
  margin-top: 10px;
  margin-left: 20px;
  // @media (max-width: 768px) {
  //   font-size: 12px;
  // }
`;

const StyledCardImg = styled.img`
  width: 40px;
  height: 40px;
  margin-left: ${(props) => props.theme.spacing[3]}px;
  margin-right: ${(props) => props.theme.spacing[2]}px;
`;

const StyledCardTitle = styled.div`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 18px;
  font-weight: 700;
`;

const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[400]};
`;

const StyledTextWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

const StyledApyDiv = styled.div`
    background-color: #3b2942;
    border: 1px solid #3b2942;
    border-radius: 12px;
    box-shadow: inset 1px 1px 0px #3b2942;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    align-items: center;
`;

const StyledBoardroomTip = styled.div`
  display: flex;
  flex-direction: column;
  width: 900px;
  font-size: 16px;
  color: #bdbdbd;
  padding: 10px 20px;
  border: 1px solid #bdbdbd;
  border-radius: 12px;
  margin-top: 40px;
  @media (max-width: 768px) {
    width: 80%;
    font-size: 14px;
  }
`;
const StyledBoardroomTipItem = styled.div`
`;

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledHeader = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 960px;

  > * {
    flex: 1;
    height: 84px;
    margin: 0 ${(props) => props.theme.spacing[2]}px;
     @media (max-width: 768px) {
        margin-bottom:10px
      }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 81%;
  }
`;

const StyledHeader1 = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 960px;

  > * {
    flex: 1;
    height: 84px;
    margin: 0 ${(props) => props.theme.spacing[2]}px;
     @media (max-width: 768px) {
        margin-bottom:10px
      }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 81%;
  }
`;

const StyledNoticeWrapper = styled.div`
  width: 768px;
  margin-top: -20px;
  margin-bottom: 40px;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Boardroom;
