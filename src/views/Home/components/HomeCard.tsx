import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import Label from '../../../components/Label';
import { TokenStat } from '../../../basis-cash/types';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import TokenSymbol from '../../../components/TokenSymbol';
import { commify } from 'ethers/lib/utils';
import config from '../../../config';

interface HomeCardProps {
  title: string;
  symbol: string;
  color: string;
  supplyLabel?: string;
  address: string;
  stat?: TokenStat;
}

const HomeCard: React.FC<HomeCardProps> = ({
  title,
  symbol,
  color,
  address,
  supplyLabel = 'Total Supply',
  stat,
}) => {
  const tokenUrl = `${config.etherscanUrl}/token/${address}`;
  return (
    <Wrapper>
      <CardHeader>{title}</CardHeader>
       <StyledCards>
         {
           address === 'airdrop' ?
           <StyledAirdropSoon>
             <div>Airdrop</div>
             Coming soon
            </StyledAirdropSoon> :
             !address ?
            <StyledSoon>
              Coming soon
            </StyledSoon> : null
         }

           <StyledBlur color={address}>
             <TokenSymbol symbol={symbol} />
             <CardSection>
                 {stat ? (
                     <StyledValue>{(stat.priceInDAI !== '-' ? '$' : '') + stat.priceInDAI}</StyledValue>
                 ) : (
                     address ? <ValueSkeleton /> : <StyledValue>$0.00</StyledValue>
                 )}
               <Label text="Current Price" color={color} />
             </CardSection>
             <CardSection>
                 {stat ? <StyledValue>{commify(stat.totalSupply)}</StyledValue> :  address ? <ValueSkeleton /> : <StyledValue>0.00</StyledValue>}
               <StyledSupplyLabel href={tokenUrl} target="_blank" color={color}>
                   {supplyLabel}
               </StyledSupplyLabel>
             </CardSection>
               {!symbol && <StyledSoon>coming soon</StyledSoon>}
           </StyledBlur>
      </StyledCards>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  @media (max-width: 768px) {
    margin-top: ${(props) => props.theme.spacing[4]}px;
  }
`;

const StyledSoon = styled.div`
   position:absolute;
   top:0;
   left:0;
   width: 100%;
   text-align:center;
   font-size: 38px;
   z-index:999;
   padding: 106px 0;
   font-weight: 600;
`;

const StyledAirdropSoon = styled.div`
   position:absolute;
   top:0;
   left:0;
   width: 100%;
   text-align:center;
   font-size: 38px;
   z-index:999;
   padding: 80px 0;
   font-weight: 600;
`;

const CardHeader = styled.h2`
  color: #fff;
  text-align: center;
`;

const StyledCards = styled.div`
  position:relative;
  min-width: 250px;
  padding: ${(props) => props.theme.spacing[3]}px;
  color: ${(props) => props.theme.color.white};
  background-color: #3b2942;
  border-radius: 5px;
  @media (max-width: 768px) {
    width: 0;
  }
`;

const StyledBlur = styled.div`
   -webkit-filter:${(props) => props.color && props.color ==='airdrop'?'blur(0px)':'blur(2px)'}; /* Chrome, Opera */
   -moz-filter: ${(props) => props.color && props.color ==='airdrop'?'blur(0px)':'blur(2px)'};
   -ms-filter: ${(props) => props.color && props.color ==='airdrop'?'blur(0px)':'blur(2px)'};    
   filter: ${(props) => props.color && props.color !=='airdrop'?'blur(0px)':'blur(3px)'};
`;


const StyledValue = styled.span`
  display: inline-block;
  font-size: 36px;
  color: #eeeeee;
`;

const CardSection = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ValueSkeletonPadding = styled.div`
  padding-top: ${(props) => props.theme.spacing[3]}px;
  padding-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledSupplyLabel = styled.a`
  display: block;
  color: ${(props) => props.color};
`;

const ValueSkeleton = () => {
  const theme = useContext(ThemeContext);
  return (
    <SkeletonTheme color={theme.color.grey[700]} highlightColor={theme.color.grey[600]}>
      <ValueSkeletonPadding>
        <Skeleton height={10} />
      </ValueSkeletonPadding>
    </SkeletonTheme>
  );
};

const GuideText = styled.span`
  color: ${(props) => props.theme.color.primary.main};
  font-size: 0.8rem;
`;

const ValueText = styled.p`
  color: ${(props) => props.theme.color.white};
  font-weight: bold;
  font-size: 1.25rem;
  margin: ${(props) => props.theme.spacing[1]}px 0;
`;

export default HomeCard;
