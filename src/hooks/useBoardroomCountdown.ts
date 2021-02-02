import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisCash from './useBasisCash';
import config from '../config';
import { BoardroomAllocationTime } from '../basis-cash/types';

const useBoardroomCountdown = (address: string) => {

  const [time, setTime] = useState<BoardroomAllocationTime>({
    rewardAllocation: new Date(),
    withdrawAllocation: new Date(),
    dropoutAllocation: new Date()
  });
  const basisCash = useBasisCash();

  // const fetchBalance = useCallback(async () => {
  //   setBalance(await basisCash.getStakedSharesOnBoardroom());
  // }, [basisCash?.isUnlocked]);

  // useEffect(() => {
  //   if (basisCash?.isUnlocked) {
  //     fetchBalance().catch((err) => console.error(err.stack));

  //     const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
  //     return () => clearInterval(refreshBalance);
  //   }
  // }, [basisCash?.isUnlocked, setBalance, basisCash]);

  useEffect(() => {
    if (basisCash?.isUnlocked) {
      basisCash.getTreasuryCountdown(address).then(setTime);
    }
  }, [basisCash?.isUnlocked, basisCash]);
  return time;
};

export default useBoardroomCountdown;


// import { useEffect, useState } from 'react';
// import useBasisCash from './useBasisCash';
// import config from '../config';
// import { TreasuryAllocationTime } from '../basis-cash/types';

// const useTreasuryAllocationTimes = () => {
//   const [time, setTime] = useState<TreasuryAllocationTime>({
//     prevAllocation: new Date(),
//     nextAllocation: new Date(),
//   });
//   const basisCash = useBasisCash();

//   useEffect(() => {
//     if (basisCash) {
//       basisCash.getTreasuryNextAllocationTime().then(setTime);
//     }
//   }, [basisCash]);
//   return time;
// };

// export default useTreasuryAllocationTimes;

