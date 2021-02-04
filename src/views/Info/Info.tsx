import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import axios from 'ts-axios-new'
import { apiUrl } from '../../basis-cash/config';
import { commify } from 'ethers/lib/utils';
import { OverviewData, LpPoolData } from './types';
import useBasisCash from '../../hooks/useBasisCash';
import config from '../../config';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import moment from 'moment';
import ProgressCountdown from './components/ProgressCountdown';
import useBondOraclePriceInLastTWAP from '../../hooks/useBondOraclePriceInLastTWAP';
import { getDisplayBalance } from '../../utils/formatBalance';

const Info: React.FC = () => {
    const basisCash = useBasisCash();
    const instance = axios.create();

    let cashPrice = useBondOraclePriceInLastTWAP();
    const isCashPriceable = useMemo(() => Number(cashPrice) < 1.05, [cashPrice]);
    
    const { prevAllocation, nextAllocation } = useTreasuryAllocationTimes();
    const prevEpoch = useMemo(
        () =>
        nextAllocation.getTime() <= Date.now()
            ? moment().utc().startOf('day').toDate()
            : prevAllocation,
        [prevAllocation, nextAllocation],
    );

    const nextEpoch = useMemo(() => moment(prevEpoch).add(6, 'hours').toDate(), [prevEpoch]);
  
    const [{ cash, bond, share }, setStats] = useState<OverviewData>({});
    const fetchStats = useCallback(async () => {
        const [cash, bond, share] = await Promise.all([
        basisCash.getCashStatFromUniswap(),
        basisCash.getBondStat(),
        basisCash.getShareStat(),
        ]);
        if (Date.now() < config.bondLaunchesAt.getTime()) {
        bond.priceInDAI = '0.00';
        }
        setStats({ cash, bond, share });
    }, [basisCash, setStats]);

    const [{ pool2, pool3, pool4, treasury, bxcUnstaked, boardroom, bxsUnstaked }, setPool] = useState<LpPoolData>({});
    const fetchLPPool = useCallback(async() => {
        const data = await instance.get(apiUrl + '/num')
        const pool2 = data.data.data[0].balance
        const pool3 = data.data.data[1].balance
        const pool4 = data.data.data[1].bxsSuvsBalance
        const treasury = data.data.data[0].treasury
        const bxcUnstaked = data.data.data[0].unstaked
        const boardroom = data.data.data[1].boardroom
        const bxsUnstaked = data.data.data[1].unstaked
        setPool({ pool2, pool3, pool4, treasury, bxcUnstaked, boardroom, bxsUnstaked })
    }, [setPool])

    const [arr, setApyTvl] = useState<Array<any>>([]);
    const fetchApyTvl = useCallback(async() => {
        const data = await instance.get(apiUrl + '/getInfo')
        const arr = data.data.data
        setApyTvl(arr)
    }, [setPool])

    useEffect(() => {
        if (basisCash) {
          fetchStats().catch((err) => console.error(err.stack));
          fetchLPPool()
        //   fetchApyTvl()
          const refreshInterval = setInterval(() => {
            fetchStats().catch((err) => console.error(err.stack));
            fetchLPPool()
            // fetchApyTvl()
          }, 10000)
          return () => clearInterval(refreshInterval);
        }
      }, [basisCash]);

    return (
        <Page>
            <StyledInfo>
                <StyledBanner>
                    <StyledFlexBanner>
                        <StyledDiv>
                            <StyledSubtitle>Next Epoch:</StyledSubtitle>
                            {
                                isCashPriceable ?
                                <StyledMinTitle>There is expected to be no supply increase based on the current SUVC TWAP of ${getDisplayBalance(cashPrice, 18, 2)} .</StyledMinTitle> :
                                <StyledMinTitle>There is expected to be supply increase based on the current SUVC TWAP of ${getDisplayBalance(cashPrice, 18, 2)} .</StyledMinTitle>
                            }
                            
                            {/*<StyledMinTitle style="display: none;">The supply will be increased 0.000 based on the current SUVC TWAP of $0.000 .Returning NaN SUVC per SUVS</StyledMinTitle>*/}
                        </StyledDiv>
                    </StyledFlexBanner>
                </StyledBanner>
                <StyledInfoBox>
                    <StyledTotalMsg>
                        <StyledTotalLeftLi>
                            <StyledSection>
                                <StyledInfoBoxH3>Next Epoch</StyledInfoBoxH3>
                                <StyledInfoTotalBoxP1>
                                <ProgressCountdown
                                        base={prevEpoch}
                                        deadline={nextEpoch}
                                        description="Next Epoch"
                                    />
                                </StyledInfoTotalBoxP1>
                            </StyledSection>
                            <StyledSection>
                                <StyledInfoBoxH3>SUVC Spot Price</StyledInfoBoxH3>
                                <StyledInfoBoxPRight>${cash?.priceInDAI}</StyledInfoBoxPRight>
                            </StyledSection>
                        </StyledTotalLeftLi>
                        <StyledTotalRightLi>
                            <StyledSection>
                                <StyledInfoBoxH3>SUVC TWAP Price</StyledInfoBoxH3>
                                <StyledInfoTotalBoxP>${getDisplayBalance(cashPrice, 18, 2)}</StyledInfoTotalBoxP>
                            </StyledSection>
                            <StyledSection>
                                <StyledInfoBoxH3>SUVC Supply</StyledInfoBoxH3>
                                <StyledInfoBoxPRight>{cash?.totalSupply}</StyledInfoBoxPRight>
                            </StyledSection>
                        </StyledTotalRightLi>
                    </StyledTotalMsg>
                    <StyledOtherMsg>
                        <StyledLeftLi>
                            <StyledInfoBoxH3>Supply</StyledInfoBoxH3>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>SUVS Supply:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{share?.totalSupply}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>SUVB Supply:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{bond?.totalSupply}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                        </StyledLeftLi>
                        <StyledRightLi>
                            <StyledInfoBoxH3>Price</StyledInfoBoxH3>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>SUVS Price:</StyledInfoBoxP>
                                <StyledInfoBoxNum>${share?.priceInDAI}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>SUVB Price:</StyledInfoBoxP>
                                <StyledInfoBoxNum>${bond?.priceInDAI}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                        </StyledRightLi>
                    </StyledOtherMsg>
                    <StyledOtherMsg>
                        <StyledLeftLi>
                            <StyledInfoBoxH3>SUVC Metrics</StyledInfoBoxH3>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>Treasury SUVC:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{treasury}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>Unstaked SUVC:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{bxcUnstaked}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                        </StyledLeftLi>
                        <StyledRightLi>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>SUVC in SUVC/USDT Pool:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{(pool2)}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                            <StyledOtherMsgSection>
                                {/* <StyledInfoBoxP>SUVC in SUVC/HBTC Pool:</StyledInfoBoxP>
                                <StyledInfoBoxNum> 0.000</StyledInfoBoxNum> */}
                            </StyledOtherMsgSection>
                        </StyledRightLi>
                    </StyledOtherMsg>
                    <StyledOtherMsg>
                        <StyledLeftLi>
                            <StyledInfoBoxH3>SUVS Metrics</StyledInfoBoxH3>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>Boardroom SUVS:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{boardroom}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>Unstaked SUVS:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{bxsUnstaked}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                        </StyledLeftLi>
                        <StyledRightLi>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>SUVS in SUVS/USDT Pool:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{(pool3)}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                            <StyledOtherMsgSection>
                                <StyledInfoBoxP>SUVS in SUVS/BXS Pool:</StyledInfoBoxP>
                                <StyledInfoBoxNum>{pool4}</StyledInfoBoxNum>
                            </StyledOtherMsgSection>
                        </StyledRightLi>
                    </StyledOtherMsg>
                </StyledInfoBox>
            </StyledInfo>
        </Page>
    );
};

const StyledDiv = styled.div`
`;
const StyledInfo = styled.div`
    width:100%;
    @media (max-width: 768px) {
        margin-top:60px
    }
`;

const StyledBanner = styled.div`
  padding-top: 30px;
  padding-bottom: 150px;
`;

const StyledFlexBanner = styled.div`
    max-width: 960px;
    width: 90vw;
    margin: 0 auto;
    display: flex;
    align-items: center;
`;


const StyledSubtitle = styled.h3`
  font-size: 36px;
  color: #fff;
  @media (max-width: 768px) {
       padding 0 20px
    }
`

const StyledMinTitle = styled.p`
    margin-top: 30px;
    color: #fff;
    font-size:16px
    @media (max-width: 768px) {
       padding 0 20px
    }
`
const StyledInfoBox = styled.div`
 position: relative;
    top: -80px;
    max-width: 800px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 50px 30px;
    @media (max-width: 768px) {
       padding: 30px 20px;
       width: 90%;
    }
`;

const StyledTotalMsg = styled.ul`
    padding:0;
    margin:0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: row;
     @media (max-width: 768px) {
       flex-direction: column;
       align-items: center;
    }
`

const StyledTotalLeftLi = styled.li`
   margin-right: 50px;
   height: 67px;
   font-size: 16px;
    color: #fff;
    flex: 1 1 0%;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
     @media (max-width: 768px) {
       margin-right: 0;
       flex-direction: column;
       width:100%
    }
`
const StyledTotalRightLi = styled.li`
   margin-left: 50px;
   font-size: 16px;
   height: 67px;
    color: #fff;
    flex: 1 1 0%;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    @media (max-width: 768px) {
       margin-left: 0;
        width:100%;
        flex-direction: column;
    }
`

const StyledLeftLi = styled.li`
   margin-right: 50px;
   font-size: 16px;
    color: #bdbdbd;
    flex: 1 1 0%;
    flex-direction: column;
    display: flex;
    justify-content: space-between;
     @media (max-width: 768px) {
       margin-right: 0;
       flex-direction: column;
        width:100%
    }
`

const StyledLeftLi1 = styled.li`
//    margin-right: 50px;
   font-size: 16px;
    color: #fff;
    // flex: 1 1 0%;
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    width: 43%;
    margin-bottom: 20px;
     @media (max-width: 768px) {
       margin-right: 0;
       flex-direction: column;
        width:100%
    }
`
const StyledSection = styled.section`
    display: flex;
    flex-direction: column;
     @media (max-width: 768px) {
      justify-content: space-between;
      flex-direction: row;
    }
`

const StyledInfoBoxH3 = styled.h3`
 font-size: 18px;
    color: #f4dc27;
    margin-bottom: 5px;
    margin-top:0
`
const StyledInfoBoxP = styled.p`
    color: #bdbdbd;
    margin-top: 5px;
    font-size: 16px;
    margin-bottom:0
`
const StyledInfoTotalBoxP1 = styled.p`
    color: #fff;
    margin-top: 5px;
    font-size: 16px;
    margin-bottom:0;
    @media (max-width: 768px) {
        margin-top: 0px;
     }
`
const StyledInfoTotalBoxP = styled.p`
    color: #fff;
    margin-top: 5px;
    font-size: 16px;
    margin-bottom:0;
`

const StyledInfoBoxNum = styled.p`
    color: #FFF;
    margin-top: 5px;
    font-size: 16px;
    margin-bottom:0;
    @media (max-width: 768px) {
       max-width:150px;
       word-break:break-all
    }
`

const StyledInfoBoxPRight = styled.p`
    color: #FFF;
    margin-top: 5px;
    font-size: 16px;
    margin-bottom:0;
     @media (max-width: 768px) {
       text-align:right;
    }
`
const StyledRightLi = styled.li`
   margin-left: 50px;
   font-size: 16px;
    color: #FFF;
    flex: 1 1 0%;
    flex-direction: column;
    display: flex;
    justify-content: space-between;
     @media (max-width: 768px) {
       margin-left: 0;
        width:100%
    }
`
const StyledOtherMsg = styled.ul` 
    padding:0;
    margin:0;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    @media (max-width: 768px) {
        flex-direction: column;
    }
    
`
const StyledOtherMsgSection = styled.section`
    margin-bottom: 5px;
    flex-direction: row;
    justify-content: space-between;
    display: flex;
`

const StyledH2 = styled.h2` 
    font-size: 22px;
    color: #f4dc27;
    margin-top: 20px;
`
export default Info;
