import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components';
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'

import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { BigNumber } from 'ethers';
import ProgressCountdowns from './ProgressCountdowns'

interface WithdrawModalProps extends ModalProps {
  max: BigNumber,
  onConfirm: (amount: string) => void,
  tokenName?: string,
  withdrawAllocation?: any
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '', withdrawAllocation }) => {
  const [val, setVal] = useState('')

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const flagTime = new Date().getTime() < withdrawAllocation.getTime()

  console.log(flagTime)
  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        {
            flagTime ?
            <StyledCardActionsCountDown>
              <StyledDivItem1>Confirm</StyledDivItem1>
              <ProgressCountdowns
              deadline={withdrawAllocation}
              />
            </StyledCardActionsCountDown>:
            <Button text="Confirm" onClick={() => onConfirm(val)} />
        }
      </ModalActions>
    </Modal>
  )
}

const StyledDivItem1 = styled.div`
  font-size: 18px;
  color: ${(props) => props.theme.color.grey[400]};
`;
const StyledCardActionsCountDown = styled.div`
  display: flex;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(62, 49, 31);
  border: 0px;
  border-radius: 12px;
  color: rgb(244, 220, 39);
  cursor: pointer;
  display: flex;
  font-weight: 700;
  height: 60px;
  -webkit-box-pack: center;
  justify-content: center;
  outline: none;
  padding-left: 24px;
  padding-right: 24px;
  width: 80%;
  flex-direction: column;
  font-size: 16px;
`;

export default WithdrawModal
