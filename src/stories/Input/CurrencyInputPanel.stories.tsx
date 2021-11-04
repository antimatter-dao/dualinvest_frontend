import { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'

import { Currency } from 'constants/token'

export default {
  title: 'Input/ CurrencyInputPanel ',
  component: CurrencyInputPanel
} as ComponentMeta<typeof CurrencyInputPanel>

export const Default = () => {
  const [value, setValue] = useState('')
  const [currency, setCurrency] = useState<Currency | undefined>(undefined)

  return (
    <CurrencyInputPanel
      currency={currency}
      value={value}
      onChange={val => setValue(val.target.value)}
      onSelectCurrency={cur => {
        setCurrency(cur)
      }}
    />
  )
}
