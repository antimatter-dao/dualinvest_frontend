import { useCallback, useState, useEffect, useMemo } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import OutlineButton from 'components/Button/OutlineButton'
import NumericalInput from 'components/Input/InputNumerical'
import Modal from 'components/Modal'
import { ETHER, Token } from 'constants/token'
// import Select from 'components/Select/Select'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { StatusIcon } from 'components/Modal/TransactionModals/DestinationAddress'
import { useActiveWeb3React } from 'hooks'
import { useETHBalances, useTokenBalance } from 'state/wallet/hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import ActionButton from 'components/Button/ActionButton'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { tryParseAmount } from 'utils/parseAmount'
// import ConfirmModal from './ConfirmModal'
import { useTransaction } from 'state/transactions/hooks'
import { OutlinedCard } from 'components/Card/Card'
import { DUAL_INVEST_ADDRESS } from 'constants/index'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useDualInvestBalance, useDualInvestCallback } from 'hooks/useDualInvest'
import useModal from 'hooks/useModal'
import { TokenAmount } from 'constants/token'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { DEFAULT_COIN_SYMBOL } from 'constants/currencies'

export enum ActionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

export default function ActionModal({
  isOpen,
  onDismiss,
  type,
  token
}: // currencyInput
{
  token?: Token
  isOpen: boolean
  type: ActionType
  // currencyInput?: boolean
  onDismiss: () => void
}) {
  const [val, setVal] = useState('')
  // const [isConfirmed, setIsConfrirmed] = useState(false)
  // const [selectedCur, setSelectedCur] = useState('ETH')
  // const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const actionStr = type === ActionType.DEPOSIT ? 'Deposit' : 'Withdraw'
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const { connector, account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  const [hash, setHash] = useState('')
  const { hideModal, showModal } = useModal()
  const contractBalance = useDualInvestBalance(token)
  const balanceToken = useTokenBalance(account ?? undefined, token)
  const balanceETH = useETHBalances([account ?? undefined])?.[account ?? '']
  const txn = useTransaction(hash)
  const [approvalState, approveCallback] = useApproveCallback(
    tryParseAmount(val, token?.symbol === DEFAULT_COIN_SYMBOL[chainId ?? NETWORK_CHAIN_ID] ? ETHER : token),
    DUAL_INVEST_ADDRESS[chainId ?? NETWORK_CHAIN_ID]
  )
  const balance = token?.symbol === DEFAULT_COIN_SYMBOL[chainId ?? NETWORK_CHAIN_ID] ? balanceETH : balanceToken

  const handleMax = useCallback(() => {
    if (balance && type === ActionType.DEPOSIT) {
      setVal(balance?.toExact())
      return
    }
    if (contractBalance && type === ActionType.WITHDRAW) {
      setVal(contractBalance)
      return
    }
  }, [balance, contractBalance, type])

  const handleDismiss = useCallback(() => {
    setVal('')
    setHash('')
    setPending(false)
    // setIsConfrirmed(false)
    // setSelectedCur('ETH')
    onDismiss()
  }, [onDismiss])

  const handleSucccessModal = useCallback(() => {
    hideModal()
    handleDismiss()
    showModal(
      <TransactionSubmittedModal
        header={actionStr === 'Withdraw' ? actionStr + 'al Successful!' : actionStr + ' Successful!'}
      >
        <Typography fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
          You have successfully {type === ActionType.DEPOSIT ? type + 'ed' : type + 'n'} {val} {token?.symbol}
        </Typography>
      </TransactionSubmittedModal>
    )
  }, [actionStr, handleDismiss, hideModal, showModal, type, token, val])

  const handleErrorModal = useCallback(
    e => {
      console.error(e)
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

  const { onDeposit, onWithdraw } = useActionCallback(
    tryParseAmount(val, token)?.raw.toString(),
    token,
    setHash,
    handleErrorModal
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
        // setIsConfrirmed(false)
      }
    }
  }, [handleDismiss, handleSucccessModal, hash, onDismiss, showModal, txn])

  useEffect(() => {
    if (type === ActionType.DEPOSIT && balance) {
      if (+val > +balance?.toExact()) {
        setError('Insufficient Balance')
        return
      }
    }
    if (type === ActionType.WITHDRAW && contractBalance) {
      if (+val > +contractBalance) {
        setError('Insufficient Balance')
        return
      }
    }
    setError('')
  }, [balance, contractBalance, type, val])

  return (
    <>
      {/* <ConfirmModal
        actionStr={actionStr}
        isOpen={confirmModalOpen}
        onDismiss={() => {
          setIsConfrirmed(true)
          setConfirmModalOpen(false)
        }}
      >
        {actionStr} {val} {token?.symbol}
      </ConfirmModal> */}

      <Modal customIsOpen={isOpen} customOnDismiss={handleDismiss} closeIcon>
        <Box display="grid" padding="20px 32px" gap="32px">
          <Typography
            fontSize={20}
            fontWeight={{ xs: 700, sm: 400 }}
            sx={{ color: theme => ({ xs: theme.palette.text.primary, sm: theme.palette.text.secondary }) }}
          >
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
              disabled={pending}
              label={`${actionStr} Amount`}
              value={val}
              onChange={e => {
                setVal(e.target.value)
              }}
              onMax={handleMax}
              unit={token ? token.symbol : undefined}
            />

            <OutlinedCard padding="12px 16px">
              <Box display="flex" justifyContent="space-between" color={theme.palette.text.secondary}>
                <Typography>Wallet Balance</Typography>
                <Typography>{balance && token ? balance.toFixed(4) + ' ' + token.symbol : '-'}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" color={theme.palette.text.secondary}>
                <Typography>Account Balance</Typography>
                <Typography>
                  {token && contractBalance !== '-' ? (+contractBalance).toFixed(4) + ' ' + token?.symbol : '-'}
                </Typography>
              </Box>
            </OutlinedCard>
          </Box>
          {type === ActionType.DEPOSIT && (
            <Box display="flex" mt={-20}>
              <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, height: 12 }} />
              <Typography component="span" fontSize={12} sx={{ opacity: 0.5 }}>
                Please make sure there is a certain amount of {token?.symbol ?? 'BTC'} in the wallet balance, otherwise
                the deposit will fail due to insufficient handling fees.
              </Typography>
            </Box>
          )}
          <Box display={{ xs: 'grid', sm: 'flex' }} gap="16px">
            <OutlineButton onClick={handleDismiss}>Cancel</OutlineButton>
            {/* {!isConfirmed && (
              <ActionButton
                error={error ? error : val ? undefined : 'Amount required'}
                disableAction={!Number(val)}
                actionText="Confirm"
                onAction={() => {
                  setConfirmModalOpen(true)
                }}
              />
            )} */}
            {/*isConfirmed &&*/ approvalState !== ApprovalState.APPROVED && type === ActionType.DEPOSIT && (
              <ActionButton
                error={error ? error : val ? undefined : 'Amount required'}
                disableAction={!Number(val)}
                pending={approvalState === ApprovalState.PENDING}
                pendingText="Approving"
                onAction={() => {
                  showModal(<TransacitonPendingModal />)
                  approveCallback()
                }}
                actionText="Approve"
              />
            )}
            {/*isConfirmed && */ (approvalState === ApprovalState.APPROVED || type === ActionType.WITHDRAW) && (
              <ActionButton
                error={error ? error : val ? (!token ? 'No token' : undefined) : 'Amount required'}
                onAction={() => {
                  if (!token) return
                  if (type === ActionType.DEPOSIT) {
                    onDeposit()
                  }
                  if (type === ActionType.WITHDRAW) {
                    onWithdraw()
                  }
                }}
                pending={pending}
                pendingText="Pending"
                actionText={actionStr}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </>
  )
}

function useActionCallback(
  val: string | undefined,
  token: Token | undefined,
  setHash: (hash: string) => void,
  onError: (e: Error) => void
) {
  const { account, chainId } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const { depositCallback, withdrawCallback, depositETHCallback } = useDualInvestCallback()
  const addTransaction = useTransactionAdder()

  const handleDeposit = useCallback(async () => {
    if (!token || !depositCallback || !val || !account || !depositETHCallback) return
    showModal(<TransactionPendingModal />)
    try {
      const r =
        token.symbol === DEFAULT_COIN_SYMBOL[chainId ?? NETWORK_CHAIN_ID]
          ? await depositETHCallback(val, token.address)
          : await depositCallback(val, token.address)

      hideModal()
      setHash(r.hash)
      const tokenAmount = new TokenAmount(token, val)
      addTransaction(r, {
        summary: `Deposit ${tokenAmount.toExact()} ${token.symbol}`
      })
    } catch (e) {
      onError(e as Error)
    }
  }, [
    token,
    depositCallback,
    val,
    account,
    depositETHCallback,
    showModal,
    chainId,
    hideModal,
    setHash,
    addTransaction,
    onError
  ])

  const handleWithdraw = useCallback(() => {
    if (!token || !withdrawCallback || !val || !account) return
    showModal(<TransactionPendingModal />)
    withdrawCallback(val, token.address)
      .then(r => {
        hideModal()
        setHash(r.hash)
        const tokenAmount = new TokenAmount(token, val)
        addTransaction(r, {
          summary: `Withdraw ${tokenAmount.toExact()} ${token.symbol}`
        })
      })
      .catch(onError)
  }, [withdrawCallback, val, account, showModal, onError, hideModal, setHash, token, addTransaction])

  return useMemo(() => ({ onDeposit: handleDeposit, onWithdraw: handleWithdraw }), [handleDeposit, handleWithdraw])
}
