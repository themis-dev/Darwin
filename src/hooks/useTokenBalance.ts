import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20 from '../basis-cash/ERC20';
import useBasisCash from './useBasisCash';
import config from '../config';
import { getDefaultProvider } from '../utils/provider';

const useTokenBalance = (token: ERC20) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();

  const fetchBalance = useCallback(async () => {
    let amount = BigNumber.from(0);
    if(token.symbol === 'HT') {
      const provider = getDefaultProvider();
      amount = await provider.getBalance(basisCash.myAccount);
    } else {
      amount = await token.balanceOf(basisCash.myAccount);
    }
    console.log('fetchBalance:', token.symbol, amount.toString());
    setBalance(amount);
  }, [basisCash?.isUnlocked, token]);

  useEffect(() => {
    if (basisCash?.isUnlocked) {
      fetchBalance().catch((err) =>
        console.error(`Failed to fetch token balance: ${err.stack}`),
      );
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [basisCash?.isUnlocked, token]);

  return balance;
};

export default useTokenBalance;
