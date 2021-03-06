import React, { useCallback, useMemo } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
// import { BigNumber } from 'ethers';
import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useBasisCash from '../../hooks/useBasisCash';
import useBondOraclePriceInLastTWAP from '../../hooks/useBondOraclePriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../basis-cash/constants';
import bonds from '../../assets/img/bonds.png'
import { useAddPopup } from '../../state/application/hooks';
import { validateLocaleAndSetLanguage } from 'typescript';


const Bond: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const basisCash = useBasisCash();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  let cashPrice = useBondOraclePriceInLastTWAP();
  
  const bondBalance = useTokenBalance(basisCash?.BAB);
  const addPopup = useAddPopup();
  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await basisCash.buyBonds(amount);
      if (tx) {
        const bondAmount = Number(amount) / Number(getDisplayBalance(cashPrice));
        addTransaction(tx, {
          summary: `Buy ${bondAmount.toFixed(2)} SUVB with ${amount} SUVC`,
        });
      } else {
        const message = `error`;
        addPopup({ error: { message, stack: '' } });
      }
    },
    [basisCash, addTransaction, cashPrice],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await basisCash.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} SUVB` });
    },
    [basisCash, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.priceInDAI) < 0.9025, [bondStat]);
  
  const isLaunched = Date.now() >= config.bondLaunchesAt.getTime();
  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            icon={bonds}
            title="Buy & Redeem Bonds"
            subtitle="Purchase Mutant Bonds for Premium upon Redemption"
          />
          <LaunchCountdown
            deadline={config.bondLaunchesAt}
            description="How does Survival bond work?"
            descriptionLink="https://docs.basis.cash/mechanisms/stabilization-mechanism"
          />
        </Page>
      </Switch>
    );
  }
  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader
                icon={bonds}
                title="Buy & Redeem Bonds"
                subtitle="Purchase Mutant Bonds for Premium upon Redemption"
              />
            </Route>
            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={basisCash.BAC}
                  fromTokenName="Survival Cash"
                  toToken={basisCash.BAB}
                  toTokenName="Survival Bond"
                  priceDesc={
                    !isBondPurchasable
                      ? 'SUVC is over $0.95'
                      : `${Math.floor(
                          100 / Number(bondStat.priceInDAI) - 100,
                        )}% return when SUVC > $0.95`
                  }
                  onExchange={handleBuyBonds}
                  disabled={ !isBondPurchasable || !bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="SUVC"
                  description="Last-Hour TWAP Price"
                  price={getDisplayBalance(cashPrice, 18, 2)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="SUVB"
                  description="Current Price: (SUVC)^2"
                  price={bondStat?.priceInDAI || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={basisCash.BAB}
                  fromTokenName="Survival Bond"
                  toToken={basisCash.BAC}
                  toTokenName="Survival Cash"
                  priceDesc={`${getDisplayBalance(bondBalance)} SUVB Available`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when SUVC > $${BOND_REDEEM_PRICE}` : null}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button onClick={() => connect('injected')} text="Unlock Wallet" />
          </div>
        )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  width: 900px;
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

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;
