import { TokenStat } from '../../basis-cash/types';

export interface OverviewData {
  cash?: TokenStat;
  bond?: TokenStat;
  share?: TokenStat;
}


export interface tvlData {
  totaltvl?: any;
}

export interface LpPoolData {
  pool2?: any;
  pool3?: any;
  pool4?: any;
  treasury?: any;
  bxcUnstaked?: any;
  boardroom?: any;
  bxsUnstaked?: any;
}

