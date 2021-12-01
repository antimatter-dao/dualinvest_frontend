import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import NumericalInput from 'components/Input/InputNumerical'
import Modal from 'components/Modal'
import Button from 'components/Button/Button'
import { Currency } from 'constants/token'
import Select from 'components/Select/Select'

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
  return (
    <Modal customIsOpen={isOpen} customOnDismiss={onDismiss} closeIcon>
      <Box display="grid" padding="20px 32px" gap="32px">
        <Typography>{actionStr} ETH</Typography>
        {currencyInput && <Select />}
        <NumericalInput
          label={`${actionStr} Amount`}
          value={val}
          onChange={e => {
            setVal(e.target.value)
          }}
          onMax={() => {}}
          unit={currency ? currency.symbol : 'ETH'}
        />
        {children}
        <Box display="flex" gap="16px">
          <OutlineButton>Cancel</OutlineButton>
          <Button>Confirm</Button>
        </Box>
      </Box>
    </Modal>
  )
}
