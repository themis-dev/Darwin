import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Bank from '../Bank';
import BankCards from './BankCards';
import { useWallet } from 'use-wallet';
import Button from '../../components/Button';
import styled from 'styled-components';
import bank from '../../assets/img/bank.png'
import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';

const Banks: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();

  const [isLaunched, setIsLaunched] = useState(Date.now() >= config.bankLaunchesAt.getTime());
  setInterval(() => {
    setIsLaunched(Date.now() >= config.bankLaunchesAt.getTime())
  }, 2000)

  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            icon={bank}
            title="Pick Your Superpower"
            subtitle="Earn SUVS with Super Liquidity Provision"
          />
          <LaunchCountdown
            deadline={config.bankLaunchesAt}
            description=""
            descriptionLink=""
          />
        </Page>
      </Switch>
    );
  }
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <PageHeader
            icon={bank}
            title="Pick Your Superpower"
            subtitle="Earn SUVS with Super Liquidity Provision"
          />
          {!!account ? (
            <BankCards />
          ) : (
            <Center>
              <Button onClick={() => connect('injected')} text="Unlock Wallet" />
            </Center>
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Banks;
