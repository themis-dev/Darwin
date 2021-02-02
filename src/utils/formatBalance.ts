import { BigNumber } from 'ethers';

export const getDisplayBalance = (balance: BigNumber, decimals = 18, fractionDigits = 5) => {
  const number = getBalance(balance, decimals - fractionDigits);
  return (number / 10 ** fractionDigits).toFixed(fractionDigits);
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  // console.log('getFullDisplayBalance')
  // console.log(balance)
  return getDisplayBalance(balance, decimals);
};

export function getBalance(balance: BigNumber, decimals = 18) : number {
  // console.log('getBalance')
  // console.log(balance)
  return balance.div(BigNumber.from(10).pow(decimals)).toNumber();
}
