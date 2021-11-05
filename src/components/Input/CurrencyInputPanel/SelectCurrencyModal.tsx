import { useState, ChangeEvent, useCallback, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'
import CurrencyList from './CurrencyList'
import TextButton from 'components/Button/TextButton'
import Divider from 'components/Divider'
import Input from 'components/Input'
import { Currency } from 'constants/token'

export enum Mode {
  SELECT = 'select',
  IMPORT = 'import'
}

export default function SelectCurrencyModal({ onSelectCurrency }: { onSelectCurrency?: (currency: Currency) => void }) {
  const [input, setInput] = useState('')
  const [mode, SetMode] = useState(Mode.SELECT)

  const onManage = useCallback(() => {}, [])

  const onInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  useEffect(() => {
    if (input !== '') {
      return SetMode(Mode.IMPORT)
    }

    SetMode(Mode.SELECT)
  }, [input])

  return (
    <>
      <Modal closeIcon>
        <Box width="100%" display="flex" justifyContent="center" padding="24px">
          <Typography variant="inherit">Select a token</Typography>
        </Box>
        <Box padding="0 32px 23px 32px">
          <Input value={input} onChange={onInput} placeholder="Search by name or paste address" outlined />
        </Box>
        <Divider />
        <Box paddingTop={'24px'}>
          <CurrencyList mode={mode} currencyOptions={[]} onSelectCurrency={onSelectCurrency} />
        </Box>
        <Divider />
        <Box height="55px" justifyContent="center" display="flex">
          <TextButton onClick={onManage} primary>
            Manage
          </TextButton>
        </Box>
      </Modal>
    </>
  )
}
