import React, { useCallback, useState } from 'react'
import { Box, Typography, MenuItem, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import NumericalInput from 'components/Input/InputNumerical'
import Modal from 'components/Modal'
import Button from 'components/Button/Button'
import { Currency } from 'constants/token'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import DummyLogo from 'assets/svg/eth_logo.svg'
import { OutlinedCard } from 'components/Card/Card'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { StatusIcon } from 'components/Modal/TransactionModals/DestinationAddress'
import { useActiveWeb3React } from 'hooks'

const data = {
  walletBalance: '2.087016 ETH',
  accountBalance: '2.087016 ETH'
}

export default function ActionModal({
  isOpen,
  onDismiss,
  type,
  children,
  currency,
  currencyInput
}: {
  currency?: Currency
  children?: React.ReactNode
  isOpen: boolean
  onDismiss: () => void
  type: 'deposit' | 'withdraw'
  currencyInput?: boolean
}) {
  const [val, setVal] = useState('')
  const [selectedCur, setSelectedCur] = useState('ETH')
  const actionStr = type === 'deposit' ? 'Deposit' : 'Withdraw'

  const { connector } = useActiveWeb3React()
  const theme = useTheme()
  const { showModal } = useModal()

  const handleSelect = useCallback(e => {
    setSelectedCur(e.target.value)
  }, [])

  const handleDismiss = useCallback(() => {
    setVal('')
    setSelectedCur('ETH')
    onDismiss()
  }, [onDismiss])

  return (
    <>
      <Modal customIsOpen={isOpen} customOnDismiss={handleDismiss} closeIcon>
        <Box display="grid" padding="20px 32px" gap="32px">
          <Typography fontSize={20} sx={{ color: theme => theme.palette.text.secondary }}>
            {actionStr} ETH
          </Typography>
          {currencyInput && (
            <Select label="Token" width="424px" placeholder="" value={selectedCur} onChange={handleSelect}>
              <MenuItem key={'ETH'} value={'ETH'}>
                <LogoText logo={DummyLogo} text="ETH" />
              </MenuItem>
              <MenuItem key={'BTC'} value={'BTC'}>
                <LogoText logo={DummyLogo} text="BTC" />
              </MenuItem>
            </Select>
          )}
          <Box display="grid" gap="12px">
            <NumericalInput
              label={`${actionStr} Amount`}
              value={val}
              onChange={e => {
                setVal(e.target.value)
              }}
              onMax={() => {}}
              unit={currency ? currency.symbol : 'ETH'}
            />
            <OutlinedCard padding="12px 16px">
              <Box display="flex" justifyContent="space-between" color={theme.palette.text.secondary}>
                <Typography>Wallet Balance</Typography>
                <Typography>{data.walletBalance}</Typography>
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
            <Button
              onClick={() => {
                onDismiss()
                showModal(
                  <TransactionSubmittedModal header={actionStr + ' Successfully!'}>
                    <Typography fontSize={12} sx={{ color: theme => theme.palette.text.secondary }}>
                      You have successfully {type + 'ed'} X.XXX ETH
                    </Typography>
                  </TransactionSubmittedModal>
                )
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
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
