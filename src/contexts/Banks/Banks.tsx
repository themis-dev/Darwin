import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useBasisCash from '../../hooks/useBasisCash';
import { Bank } from '../../basis-cash';
import { apiUrl } from '../../basis-cash/config';
import config, { bankDefinitions } from '../../config';
import axios from 'ts-axios-new'

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const basisCash = useBasisCash();
  const instance = axios.create()

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    // instance.get('http://192.168.3.33:8090/apy')
    //   .then((response) => {
    //     console.log(response)
    //   })
    const data = await instance.get(apiUrl+'/apy')
    for (const bankInfo of Object.values(bankDefinitions)) {
      // console.log(bankInfo)
      if (bankInfo.finished) {
        if (!basisCash.isUnlocked) continue;

        // only show pools staked by user
        const balance = await basisCash.stakedBalanceOnBank(bankInfo.contract, basisCash.myAccount);
        if (balance.lte(0)) {
          continue;
        }
      }
      // data.data.data.map((v: { depositTokenName: string; tvl: any; apy: any; }) => {
        // if(v.depositTokenName === bankInfo.depositTokenName) {
        //   const obj = {
        //     tvl: v.tvl,
        //     apy: v.apy
        //   }
          const obj = {
            tvl: 0,
            apy:0
          }
          banks.push({
            ...bankInfo,
            address: config.deployments[bankInfo.contract].address,
            depositToken: basisCash.externalTokens[bankInfo.depositTokenName],
            earnToken: bankInfo.earnTokenName == 'SUVC' ? basisCash.BAC : basisCash.BAS,
            totalNum: obj,
          });
        // }
      // })
      
    }
    console.log(banks)
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [basisCash, basisCash?.isUnlocked, setBanks]);

  useEffect(() => {
    if (basisCash) {
      fetchPools()
      const refreshInterval = setInterval(() => {
        fetchPools()
        .catch(err => console.error(`Failed to fetch pools: ${err.stack}`));
      }, 10000)
      // fetchPools()
      //   .catch(err => console.error(`Failed to fetch pools: ${err.stack}`));
      return () => clearInterval(refreshInterval);
    }
  }, [basisCash, basisCash?.isUnlocked, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
