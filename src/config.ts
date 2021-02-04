import { ChainId } from 'medxswap-sdk';
import { Configuration } from './basis-cash/config';
import { BankInfo } from './basis-cash';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: 128,
    etherscanUrl: 'https://scan.hecochain.com',
    defaultProvider: 'https://http-mainnet.hecochain.com',
    deployments: require('./basis-cash/deployments/deployments.local.json'),
    externalTokens: {
      DAI: ['0xa71edc38d189767582c38a3145b5873052c3e47a', 18], // hudt 获取价格 mdex
      HT: ['0x0000000000000000000000000000000000000000', 18], //HT
      HBTC: ['0x66a79d23e58475d2738179ca52cd0b41d73f0bea', 18],
      BXS: ['0xbe0e001A5553f4421DC250A20bBdAb0e735495e3', 18],
      // HPT: ['0xe499ef4616993730ced0f31fa2703b92b50bb536', 18],
      // 'USDT': ['0xa71edc38d189767582c38a3145b5873052c3e47a', 18], // USDT
      // HDOT: ['0xa2c49cee16a5e5bdefde931107dc1fae9f7773e3', 18],
      // HETH: ['0x64ff637fb478863b7468bc97d30a5bf3a428a1fd', 18],
      'SUVC_USDT-LP': ['0xF9BF0A3403FF2bfc54433d600D5DF8Feb8ebFfB5', 18],
      'SUVS_USDT-LP': ['0x9db510Aab97f26317114d95d650a8585522e6643', 18],
      'SUVS_BXC-LP': ['0x9e7C586D3236d92DA9244A46963f78ef16eec0DF', 18],
    },
    baseLaunchDate: new Date('2021-02-01T02:00:00Z'),
    bankLaunchesAt: new Date('2021-02-07T02:00:00Z'),
    bondLaunchesAt: new Date('2021-02-12T02:00:00Z'),
    boardroomLaunchesAt: new Date('2021-02-12T02:00:00Z'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  production: {
    chainId: 128,
    etherscanUrl: 'https://scan.hecochain.com',
    defaultProvider: 'https://http-mainnet.hecochain.com',
    deployments: require('./basis-cash/deployments/deployments.local.json'),
    externalTokens: {
      DAI: ['0xa71edc38d189767582c38a3145b5873052c3e47a', 18], // hudt 获取价格 mdex
      HT: ['0x0000000000000000000000000000000000000000', 18], //HT
      HBTC: ['0x66a79d23e58475d2738179ca52cd0b41d73f0bea', 18],
      BXS: ['0xbe0e001A5553f4421DC250A20bBdAb0e735495e3', 18],
      // HPT: ['0xe499ef4616993730ced0f31fa2703b92b50bb536', 18],
      // 'USDT': ['0xa71edc38d189767582c38a3145b5873052c3e47a', 18], // USDT
      // HDOT: ['0xa2c49cee16a5e5bdefde931107dc1fae9f7773e3', 18],
      // HETH: ['0x64ff637fb478863b7468bc97d30a5bf3a428a1fd', 18],
      'SUVC_USDT-LP': ['0xF9BF0A3403FF2bfc54433d600D5DF8Feb8ebFfB5', 18],
      'SUVS_USDT-LP': ['0x9db510Aab97f26317114d95d650a8585522e6643', 18],
      'SUVS_BXC-LP': ['0x9e7C586D3236d92DA9244A46963f78ef16eec0DF', 18],
    },
    baseLaunchDate: new Date('2021-02-01T02:00:00Z'),
    bankLaunchesAt: new Date('2021-02-07T02:00:00Z'),
    bondLaunchesAt: new Date('2021-02-12T02:00:00Z'),
    boardroomLaunchesAt: new Date('2021-02-12T02:00:00Z'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  
  // {
  //   chainId: ChainId.MAINNET,
  //   etherscanUrl: 'https://etherscan.io',
  //   defaultProvider: 'https://mainnet.infura.io/v3/06ecf536272c43c78adfba29b908a68d',
  //   deployments: require('./basis-cash/deployments/deployments.mainnet.json'),
  //   externalTokens: {
  //     DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
  //     yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
  //     SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
  //     USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
  //     USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
  //     'BXC_USDT-LP': ['0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD', 18],
  //     'BXS_USDT-LP': ['0x0379dA7a5895D13037B6937b109fA8607a659ADF', 18],
  //   },
  //   baseLaunchDate: new Date('2020-11-29T23:00:00Z'),
  //   bondLaunchesAt: new Date('2020-12-05T00:00:00Z'),
  //   boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
  //   refreshInterval: 30000,
  //   gasLimitMultiplier: 1.7,
  // },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  HTCashPool: {
    name: 'Earn SUVC by HT',
    contract: 'HTCashPool',
    depositTokenName: 'HT',
    earnTokenName: 'SUVC',
    finished: false,
    sort: 7,
    // limit: '100000 HT',
  },
  BXSCashPool: {
    name: 'Earn SUVC by BXS',
    contract: 'BXSCashPool',
    depositTokenName: 'BXS',
    earnTokenName: 'SUVC',
    finished: false,
    sort: 8,
    // limit: '100000 BXS',
  },
  // 'USDTCashPool': {
  //   name: 'Earn BXC by USDT',
  //   contract: 'USDTCashPool',
  //   depositTokenName: 'USDT',
  //   earnTokenName: 'BXC',
  //   finished: false,
  //   sort: 4,
  //   limit: '50000 USDT',
  // },
  // HPTCashPool: {
  //   name: 'Earn BXC by HPT',
  //   contract: 'HPTCashPool',
  //   depositTokenName: 'HPT',
  //   earnTokenName: 'BXC',
  //   finished: false,
  //   sort: 5,
  // },
  HBTCCashPool: {
    name: 'Earn SUVC by HBTC',
    contract: 'HBTCCashPool',
    depositTokenName: 'HBTC',
    earnTokenName: 'SUVC',
    finished: false,
    sort: 9,
    // limit: '1.5 BTC',
  },
  // HDOTCashPool: {
  //   name: 'Earn BXC by HDOT',
  //   contract: 'HDOTCashPool',
  //   depositTokenName: 'HDOT',
  //   earnTokenName: 'BXC',
  //   finished: false,
  //   sort: 7,
  //   limit: '6000 HDOT',
  // },
  // HETHCashPool: {
  //   name: 'Earn BXC by HETH',
  //   contract: 'HETHCashPool',
  //   depositTokenName: 'HETH',
  //   earnTokenName: 'BXC',
  //   finished: false,
  //   sort: 8,
  //   limit: '50 HETH',
  // },
  SUVCLPTokenSharePool: {
    name: 'Earn SUVS by SUVC-USDT-LP',
    contract: 'SUVCLPTokenSharePool',
    depositTokenName: 'SUVC_USDT-LP',
    earnTokenName: 'SUVS',
    finished: false,
    sort: 1,
  },
  SUVSLPTokenSharePool: {
    name: 'Earn SUVS by SUVS-USDT-LP',
    contract: 'SUVSLPTokenSharePool',
    depositTokenName: 'SUVS_USDT-LP',
    earnTokenName: 'SUVS',
    finished: false,
    sort: 2,
  },
  SUVS_BXCLPTokenSharePool: {
    name: 'Earn SUVS by SUVS-BXC-LP',
    contract: 'SUVS_BXCLPTokenSharePool',
    depositTokenName: 'SUVS_BXC-LP',
    earnTokenName: 'SUVS',
    finished: false,
    sort: 3,
  },
  SUVCLPLockTokenSharePool: {
    name: 'Earn SUVS by SUVC-USDT-LP(LOCK UP)',
    contract: 'SUVCLPLockTokenSharePool',
    depositTokenName: 'SUVC_USDT-LP',
    earnTokenName: 'SUVS',
    finished: false,
    sort: 4,
  },
  SUVSLPLockTokenSharePool: {
    name: 'Earn SUVS by SUVS-USDT-LP(LOCK UP)',
    contract: 'SUVSLPLockTokenSharePool',
    depositTokenName: 'SUVS_USDT-LP',
    earnTokenName: 'SUVS',
    finished: false,
    sort: 5,
  },
  SUVS_BXCLockLPTokenSharePool: {
    name: 'Earn SUVS by SUVS-BXC-LP(LOCK UP)',
    contract: 'SUVS_BXCLockLPTokenSharePool',
    depositTokenName: 'SUVS_BXC-LP',
    earnTokenName: 'SUVS',
    finished: false,
    sort: 6,
  },
};

export default configurations[process.env.NODE_ENV || "development"];
