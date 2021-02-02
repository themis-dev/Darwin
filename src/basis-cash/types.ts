import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  name: string;
  contract: ContractName;
  depositTokenName: ContractName;
  earnTokenName: ContractName;
  sort: number;
  finished: boolean;
  limit?:string;
}

export interface TotalNum  {
  tvl: number;
  apy: number;
};

export interface Bank extends BankInfo {
  address: string;
  depositToken: ERC20;
  earnToken: ERC20;
  totalNum?: TotalNum;
}

export type TokenStat = {
  priceInDAI: string;
  totalSupply: string;
};

export type TreasuryAllocationTime = {
  prevAllocation: Date;
  nextAllocation: Date;
}

export type BoardroomAllocationTime = {
  rewardAllocation: Date;
  withdrawAllocation: Date;
  dropoutAllocation: Date;
}
