import React, { useState } from 'react'
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
  const actionStr = type === 'deposit' ? 'Deposit' : 'Withdraw'
  const theme = useTheme()

  return (
    <Modal customIsOpen={isOpen} customOnDismiss={onDismiss} closeIcon>
      <Box display="grid" padding="20px 32px" gap="32px">
        <Typography>{actionStr} ETH</Typography>
        {currencyInput && (
          <Select label="Token" width="424px" placeholder="">
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
          <OutlineButton>Cancel</OutlineButton>
          <Button>Confirm</Button>
        </Box>
      </Box>
    </Modal>
  )
}
