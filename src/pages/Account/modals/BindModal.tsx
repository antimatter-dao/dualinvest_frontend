import { useCallback, useEffect, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import Input from 'components/Input'
import Modal from 'components/Modal'
import useDebouncedChangeHandler from 'utils/useDebouncedChangeHandler'
import { isAddress, shortenAddress } from 'utils'
import { useReferral } from 'hooks/useReferral'
import { NO_REFERRER } from 'constants/index'
import ActionButton from 'components/Button/ActionButton'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useActiveWeb3React } from 'hooks'
import { StatusIcon } from 'components/Modal/TransactionModals/DestinationAddress'
import useModal from 'hooks/useModal'
import { useTransaction, useTransactionAdder } from 'state/transactions/hooks'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { BlackButton } from 'components/Button/Button'
import { useWalletModalToggle } from 'state/application/hooks'

export default function BindModal({
  isOpen,
  onDismiss,
  referer,
  tempReferrer
}: {
  isOpen: boolean
  onDismiss: () => void
  referer: string | undefined
  tempReferrer: string | undefined
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [hash, setHash] = useState('')
  const [pending, setPending] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const { bindCallback, invitation } = useReferral()
  const { connector, account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const addTransaction = useTransactionAdder()
  const txn = useTransaction(hash)
  const toggleWallet = useWalletModalToggle()

  const check = useCallback(
    val => {
      if (!isAddress(val) && val !== '') {
        setError('Address invalid')
        return
      }
      if (val && account && val.toLowerCase() === account.toLowerCase()) {
        setError('Cannot refer to one self')
        return
      }
      setError('')
    },
    [account]
  )

  const [v, vCheck] = useDebouncedChangeHandler(value, check, 500)

  useEffect(() => {
    vCheck(v)
  }, [v, vCheck])

  const handleChange = useCallback(e => {
    setValue(e.target.value)
  }, [])

  const handleResetValue = useCallback(() => {
    setValue('')
    setPlaceholder('Please input referrer address')
  }, [])

  const handleDismiss = useCallback(() => {
    setValue('')
    setHash(tempReferrer ?? '')
    setPending(false)
    onDismiss()
  }, [onDismiss, tempReferrer])

  const handleSucccessModal = useCallback(() => {
    hideModal()
    handleDismiss()
    showModal(
      <TransactionSubmittedModal header={'Bound Successfully!'}>
        <Typography fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
          You have successfully bound to {value}
        </Typography>
      </TransactionSubmittedModal>
    )
  }, [hideModal, handleDismiss, showModal, value])

  const handleErrorModal = useCallback(
    e => {
      handleDismiss()
      hideModal()
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
        showModal(
          <MessageBox type="error" width="100%">
            {e.message.include('Already invite') ? 'Already bound' : e.message}
          </MessageBox>
        )
      }
    },
    [connector, handleDismiss, hideModal, showModal]
  )

  const handleBind = useCallback(() => {
    if (!invitation || invitation !== NO_REFERRER) return
    showModal(<TransacitonPendingModal />)
    bindCallback(value)
      .then(r => {
        hideModal()
        setHash(r.hash)
        addTransaction(r, {
          summary: `successfully bound to ${shortenAddress(value)} `
        })
      })
      .catch(e => {
        handleErrorModal(e)
      })
  }, [addTransaction, bindCallback, handleErrorModal, hideModal, invitation, showModal, value])

  useEffect(() => {
    setPlaceholder(referer ? referer : tempReferrer ? tempReferrer : 'Please input referrer address')
    if (tempReferrer) {
      setValue(tempReferrer)
    }
  }, [referer, tempReferrer])

  useEffect(() => {
    if (hash && !txn?.receipt) {
      setPending(true)
    }
    if (txn?.receipt) {
      if (txn?.receipt?.status === 1) {
        handleSucccessModal()
      }
      if (txn?.receipt?.status !== 1) {
        setValue(tempReferrer ?? '')
        setHash('')
        setPending(false)
        // setIsConfrirmed(false)
      }
    }
  }, [handleDismiss, handleSucccessModal, hash, onDismiss, showModal, tempReferrer, txn])

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box display="grid" padding="40px" gap="22px">
        <Typography align="center" fontSize={20} fontWeight={500}>
          Confirm binding
        </Typography>
        <Box display="grid" gap={18}>
          <Typography fontSize={18} fontWeight={500} color="#00000060">
            Referral account
          </Typography>
          <Box>
            <Input
              error={!!error}
              disabled={!!referer}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              endAdornment={
                <IconButton sx={{ marginLeft: 10 }} onClick={handleResetValue}>
                  <CancelOutlinedIcon />
                </IconButton>
              }
            />
            <Typography mt={8} color="error">
              {error}
            </Typography>
          </Box>
        </Box>
        {!account && <BlackButton onClick={toggleWallet}>Connect Wallet</BlackButton>}
        {invitation && invitation === NO_REFERRER && (
          <ActionButton
            actionText="Confirm"
            onAction={handleBind}
            error={error}
            disableAction={!value || !!error}
            pending={pending}
            pendingText="Pending Confirmation"
          />
        )}
      </Box>
    </Modal>
  )
}
