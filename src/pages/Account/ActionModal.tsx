import React, { useCallback, useState, useEffect } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import NumericalInput from 'components/Input/InputNumerical'
import Modal from 'components/Modal'
import { Token } from 'constants/token'
// import Select from 'components/Select/Select'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { StatusIcon } from 'components/Modal/TransactionModals/DestinationAddress'
import { useActiveWeb3React } from 'hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import ActionButton from 'components/Button/ActionButton'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { tryParseAmount } from 'utils/parseAmount'
import ConfirmDepositModal from './ConfirmDepositModal'
import { useTransaction } from 'state/transactions/hooks'
import { OutlinedCard } from 'components/Card/Card'
import { DUAL_INVEST_ADDRESS } from 'constants/index'

const data = {
  walletBalance: '2.087016 ETH',
  accountBalance: '2.087016 ETH'
}

export enum ActionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

export default function ActionModal({
  isOpen,
  onDismiss,
  type,
  children,
  token,
  onAction
}: // currencyInput
{
  token?: Token
  children?: React.ReactNode
  isOpen: boolean
  type: ActionType
  // currencyInput?: boolean
  onDismiss: () => void
  onAction: (
    val: string | undefined,
    token: Token,
    setHash: (hash: string) => void,
    onError: (e: Error) => void
  ) => void
}) {
  const [val, setVal] = useState('')
  const [isConfirmed, setIsConfrirmed] = useState(false)
  // const [selectedCur, setSelectedCur] = useState('ETH')
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const actionStr = type === ActionType.DEPOSIT ? 'Deposit' : 'Withdraw'
  const [pending, setPending] = useState(false)
  const { connector, account } = useActiveWeb3React()
  const theme = useTheme()
  const [hash, setHash] = useState('')
  const { hideModal, showModal } = useModal()
  const balance = useTokenBalance(account ?? undefined, token)
  const txn = useTransaction(hash)
  const [approvalState, approveCallback] = useApproveCallback(tryParseAmount(val, token), DUAL_INVEST_ADDRESS)

  // const handleSelect = useCallback(e => {
  //   setSelectedCur(e.target.value)
  // }, [])

  const handleDismiss = useCallback(() => {
    setVal('')
    setHash('')
    setPending(false)
    setIsConfrirmed(false)
    // setSelectedCur('ETH')
    onDismiss()
  }, [onDismiss])

  const handleSucccessModal = useCallback(() => {
    hideModal()
    handleDismiss()
    showModal(
      <TransactionSubmittedModal header={actionStr + ' Successfully!'}>
        <Typography fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
          You have successfully {type + 'ed'} {val} {token?.symbol}
        </Typography>
      </TransactionSubmittedModal>
    )
  }, [actionStr, handleDismiss, hideModal, showModal, type, token, val])

  const handleErrorModal = useCallback(
    e => {
      hideModal()
      handleDismiss()
      if (e.code === 4001) {
        showModal(
          <MessageBox
            type={
              StatusIcon(connector) ? (
                <Box
                  sx={{
                    border: '1px solid #232323',
                    height: 40,
                    width: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    '& img': {
                      height: '21px!important',
                      width: '21px!important'
                    }
                  }}
                >
                  {StatusIcon(connector)}
                </Box>
              ) : (
                'failure'
              )
            }
          >
            <Typography fontSize={20}>Message signature was denied by user</Typography>
          </MessageBox>
        )
      } else {
        showModal(<MessageBox type="error">{e.message}</MessageBox>)
      }
    },
    [connector, handleDismiss, hideModal, showModal]
  )

  useEffect(() => {
    if (approvalState === ApprovalState.APPROVED) {
      hideModal()
    }
  }, [approvalState, hideModal])

  useEffect(() => {
    if (hash && !txn?.receipt) {
      setPending(true)
    }
    if (txn?.receipt) {
      if (txn?.receipt?.status === 1) {
        handleSucccessModal()
      }
      if (txn?.receipt?.status !== 1) {
        setVal('')
        setHash('')
        setPending(false)
        setIsConfrirmed(false)
      }
    }
  }, [handleDismiss, handleSucccessModal, hash, onDismiss, showModal, txn])

  return (
    <>
      <ConfirmDepositModal
        isOpen={confirmModalOpen}
        onDismiss={() => {
          setIsConfrirmed(true)
          setConfirmModalOpen(false)
        }}
      >
        Deposit {val} {token?.symbol}
      </ConfirmDepositModal>

      <Modal customIsOpen={isOpen} customOnDismiss={handleDismiss} closeIcon>
        <Box display="grid" padding="20px 32px" gap="32px">
          <Typography fontSize={20} sx={{ color: theme => theme.palette.text.secondary }}>
            {actionStr} {token?.symbol}
          </Typography>
          {/* {currencyInput && (
            <Select label="Token" width="424px" placeholder="" value={selectedCur} onChange={handleSelect}>
              <MenuItem key={'ETH'} value={'ETH'}>
                <LogoText logo={DummyLogo} text="ETH" />
              </MenuItem>
              <MenuItem key={'BTC'} value={'BTC'}>
                <LogoText logo={DummyLogo} text="BTC" />
              </MenuItem>
            </Select>
          )} */}
          <Box display="grid" gap="12px">
            <NumericalInput
              disabled={isConfirmed}
              label={`${actionStr} Amount`}
              value={val}
              onChange={e => {
                setVal(e.target.value)
              }}
              onMax={
                balance !== undefined
                  ? () => {
                      setVal(balance.toExact())
                    }
                  : undefined
              }
              unit={token ? token.symbol : undefined}
            />

            <OutlinedCard padding="12px 16px">
              <Box display="flex" justifyContent="space-between" color={theme.palette.text.secondary}>
                <Typography>Wallet Balance</Typography>
                <Typography>{balance && token ? balance.toExact() + ' ' + token.symbol : '-'}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" color={theme.palette.text.secondary}>
                <Typography>Account Balance</Typography>
                <Typography>{data.accountBalance}</Typography>
              </Box>
            </OutlinedCard>
          </Box>
          {children}
          <Box display="flex" gap="16px">
            <OutlineButton onClick={handleDismiss}>Cancel</OutlineButton>
            {!isConfirmed && (
              <ActionButton
                error={val ? undefined : 'Amount required'}
                disableAction={!Number(val)}
                actionText="Confirm"
                onAction={() => {
                  setConfirmModalOpen(true)
                }}
              />
            )}
            {isConfirmed && approvalState !== ApprovalState.APPROVED && (
              <ActionButton
                pending={approvalState === ApprovalState.PENDING}
                pendingText="Approving"
                onAction={() => {
                  showModal(<TransacitonPendingModal />)
                  approveCallback()
                }}
                actionText="Approve"
              />
            )}
            {isConfirmed && approvalState === ApprovalState.APPROVED && (
              <ActionButton
                error={!token ? 'No token' : undefined}
                onAction={() => {
                  token && onAction(tryParseAmount(val, token)?.raw.toString(), token, setHash, handleErrorModal)
                }}
                pending={pending}
                pendingText="Pending Confirmation"
                actionText={actionStr}
              />
            )}
            {/* <ActionButton error={val ? undefined : 'Amount required'} onAction={() => {}} actionText="Confirm" /> */}
          </Box>
        </Box>
      </Modal>
    </>
  )
}
