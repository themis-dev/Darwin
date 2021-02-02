import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import HomeCard from './components/HomeCard';
import { OverviewData, tvlData } from './types';
import useBasisCash from '../../hooks/useBasisCash';
import config from '../../config';
import Notice from '../../components/Notice';
import welcome from '../../assets/img/welcome.png'
import axios from 'ts-axios-new'
import { apiUrl } from '../../basis-cash/config';
import { commify } from 'ethers/lib/utils';

const Home: React.FC = () => {
  const basisCash = useBasisCash();

  const instance = axios.create();
  // 

  const [{ cash, bond, share }, setStats] = useState<OverviewData>({});
  const [{totaltvl}, setTotaltvl] = useState<tvlData>({});
  const fetchStats = useCallback(async () => {
    const [cash, bond, share] = await Promise.all([
      basisCash.getCashStatFromUniswap(),
      basisCash.getBondStat(),
      basisCash.getShareStat(),
    ]);
    if (Date.now() < config.bondLaunchesAt.getTime()) {
      bond.priceInDAI = '-';
    }
    setStats({ cash, bond, share });
  }, [basisCash, setStats]);

  const fetchTotaltvl = useCallback(async () => {
    const data = await instance.get(apiUrl + '/totaltvl')
    const totaltvl = data.data.data
    setTotaltvl({ totaltvl });
  }, [, setStats])

  useEffect(() => {
    if (basisCash) {
      fetchStats().catch((err) => console.error(err.stack));
      // fetchTotaltvl()
      // setInterval(() => {
      //   fetchTotaltvl()
      // },5000)
    }
  }, [basisCash]);

  const cashAddr = useMemo(() => basisCash?.BAC.address, [basisCash]);
  const shareAddr = useMemo(() => basisCash?.BAS.address, [basisCash]);
  const bondAddr = useMemo(() => basisCash?.BAB.address, [basisCash]);

  return (
    <Page>
      <PageHeader
        icon={welcome}
        subtitle="Controlled Inflationary Algo Stablecoin"
        subtitle1="Max Inflation of 4% per Epoch, Faster Epoch Time of 6 Hours!"
        titleA="Get SUVC"
        titleB="Get SUVS"
        title="Darwin X-Survival of the Stable!"
        titleC="open-source"
        titleHome='audited'
      />
     {/* <StyledTotalStake>Prof. X story begins now! TVL is not important, Memes are! </StyledTotalStake> */}
     {/* {
       totaltvl && <StyledTotalStake>BasisX Currently Has <StyledTotalStakeNum>${commify(totaltvl)}</StyledTotalStakeNum> Of Total Value Locked.</StyledTotalStake>
     } */}
      <Spacer size="md" />
      <CardWrapper>
        <HomeCard
          title="Survival Cash"
          symbol="BAC"
          color="#facf09"
          supplyLabel="Circulating Supply"
          // address=''
          address={cashAddr}
          stat={cash}
        />
        <Spacer size="lg" />
        <HomeCard
          title="Survival Share"
          symbol="BAS"
          color="#EEA7ED"
          // address=''
          address={shareAddr}
          stat={share}
        />
        <Spacer size="lg" />
        <HomeCard
          title="Survival Bond"
          symbol="BAB"
          color="#ECF25C"
          // address=''
          address={bondAddr}
          stat={bond}
        />
        {/* <Spacer size="lg" /> */}
        {/* <HomeCard
            title="BasisX BTC"
            symbol="BTC"
            color="#59B9EB"
            address='airdrop'
        /> */}
      </CardWrapper>
    </Page>
  );
};

const StyledTotalStake = styled.div`
  color: #fff;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
`;
const StyledTotalStakeNum = styled.span`
  color: #f4dc27;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const StyledOverview = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledNoticeContainer = styled.div`
  max-width: 768px;
  width: 90vw;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;

export default Home;
