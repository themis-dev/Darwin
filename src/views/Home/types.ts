import { TokenStat } from '../../basis-cash/types';

export interface OverviewData {
  cash?: TokenStat;
  bond?: TokenStat;
  share?: TokenStat;
}


export interface tvlData {
  totaltvl?: any;
}
