import { InputHTMLAttributes, useCallback } from 'react'
import { Box } from '@mui/material'
import Input, { InputProps } from './index'
import { escapeRegExp } from 'utils'
import SecondaryButton from 'components/Button/SecondaryButton'
import InputLabel from './InputLabel'
import TextButton from 'components/Button/TextButton'
import { trimNumberString } from 'utils/trimNumberString'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export default function NumericalInput({
  placeholder,
  onChange,
  maxWidth,
  onMax,
  balance,
  label,
  unit,
  endAdornment,
  onDeposit,
  subStr,
  ...props
}: InputProps &
  InputHTMLAttributes<HTMLInputElement> & {
    onMax?: () => void
    balance?: string
    unit?: string
    endAdornment?: JSX.Element
    onDeposit?: () => void
    subStr?: string
  }) {
  const enforcer = (nextUserInput: string) => {
    const fixed = nextUserInput.replace(/,/g, '.')
    if (fixed === '' || inputRegex.test(escapeRegExp(fixed))) {
      return fixed
    }
    return null
  }
  const handleChange = useCallback(
    event => {
      // replace commas with periods
      const formatted = enforcer(event.target.value)
      if (formatted === null) {
        return
      }
      event.target.value = formatted
      onChange && onChange(event)
    },
    [onChange]
  )

  return (
    <Box sx={{ position: 'relative', maxWidth: maxWidth ?? 'unset', width: '100%' }}>
      {(label || balance) && (
        <Box display="flex" justifyContent="space-between">
          <InputLabel>{label}</InputLabel>
          <Box display="flex" alignItems="baseline">
            {!!balance && (
              <InputLabel style={{ fontSize: '12px' }}>
                Available: {trimNumberString(balance, 6)} {unit ?? 'MATTER'}
              </InputLabel>
            )}
            {onDeposit && (
              <TextButton fontSize={12} color="#11BF2D" style={{ marginLeft: 8 }}>
                Deposit
              </TextButton>
            )}
          </Box>
        </Box>
      )}
      <Input
        {...props} // universal input options
        maxWidth={maxWidth}
        onChange={handleChange}
        inputMode="decimal"
        title="Token Amount"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={placeholder || '0.0'}
        minLength={1}
        maxLength={79}
        spellCheck="false"
        endAdornment={
          onMax && (
            <Box gap="20px" display="flex" alignItems="center" paddingLeft="10px" paddingBottom="2px">
              {endAdornment ? endAdornment : unit && <span>{unit ?? 'MATTER'}</span>}
              <SecondaryButton
                disabled={props.disabled === true ? true : false}
                primary
                onClick={onMax}
                style={{
                  width: '60px',
                  height: '32px'
                }}
              >
                MAX
              </SecondaryButton>
            </Box>
          )
        }
        subStr={subStr}
      />
    </Box>
  )
}
