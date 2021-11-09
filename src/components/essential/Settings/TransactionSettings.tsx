import { useState, useRef } from 'react'
import { darken } from 'polished'
import { useTheme, Box, Typography, styled } from '@mui/material'
import QuestionHelper from 'components/essential/QuestionHelper'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh'
}

enum DeadlineError {
  InvalidInput = 'InvalidInput'
}

const FancyButton = styled('button')(({ theme }) => ({
  color: theme.textColor.text1,
  alignItems: 'center',
  height: '3rem',
  borderRadius: '14px',
  fontSize: '1rem',
  width: 'auto',
  minWidth: '3.5rem',
  border: `1px solid ${theme.bgColor.bg3}`,
  outline: 'none',
  padding: '14px',
  '&:hover': {
    border: `1px solid ${theme.bgColor.bg4}`
  },
  '&:focus': {
    border: `1px solid ${theme.bgColor.bg1}`
  }
}))

const Option = styled(FancyButton, {
  shouldForwardProp: prop => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  marginRight: '8px',
  '&:hover': {
    cursor: 'pointer'
  },
  border: `1px solid ${active ? theme.palette.primary.main : 'transparent'}`,
  color: active ? theme.bgColor.bg1 : theme.textColor.text1
}))

const Input = styled('input', {
  shouldForwardProp: prop => prop !== 'color'
})<{ color?: string }>(({ theme, color }) => ({
  color: color === 'red' ? theme.palette.error.main : theme.textColor.text1,
  background: 'transparent',
  fontSize: '16px',
  width: 'auto',
  outline: 'none',
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none'
  },
  textAlign: 'left'
}))

const OptionCustom = styled(FancyButton, {
  shouldForwardProp: prop => prop !== 'active' && prop !== 'warning'
})<{ active?: boolean; warning?: boolean }>(({ theme, active, warning }) => ({
  position: 'relative',
  flex: 1,
  border: active ? `1px solid ${warning ? theme.palette.error : theme.palette.primary.main}` : 'none',
  '&:hover': {
    border: active
      ? `1px solid ${warning ? darken(0.1, theme.palette.error.main) : darken(0.1, theme.palette.primary.main)}`
      : 'none'
  },
  '& input': {
    width: '100%',
    height: '100%',
    border: '0px',
    borderRadius: '2rem'
  }
}))

const SlippageEmojiContainer = styled('span')(({ theme }) => ({
  color: '#f3841e',
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}))

export interface SlippageTabsProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
  onlySlippage?: boolean
}

export default function TransactionSettings({
  rawSlippage,
  setRawSlippage,
  deadline,
  setDeadline,
  onlySlippage
}: SlippageTabsProps) {
  const theme = useTheme()

  const inputRef = useRef<HTMLInputElement>()

  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch {}
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch {}
  }

  return (
    <Box display="grid" gap="24px">
      <Box display="grid" gap="8px">
        <Box display="flex" alignItems="center">
          <Typography fontWeight={400} fontSize={14} color={theme.textColor.text2}>
            Slippage tolerance
          </Typography>
          <QuestionHelper text="Your transaction will revert if the price changes unfavorably by more than this percentage." />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(10)
            }}
            active={rawSlippage === 10}
          >
            0.1%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(50)
            }}
            active={rawSlippage === 50}
          >
            0.5%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(100)
            }}
            active={rawSlippage === 100}
          >
            1%
          </Option>
          <OptionCustom active={![10, 50, 100].includes(rawSlippage)} warning={!slippageInputIsValid} tabIndex={-1}>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              {!!slippageInput &&
              (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
                <SlippageEmojiContainer>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>
                </SlippageEmojiContainer>
              ) : null}
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <Input
                ref={inputRef as any}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((rawSlippage / 100).toFixed(2))
                }}
                onChange={e => parseCustomSlippage(e.target.value)}
                color={!slippageInputIsValid ? 'red' : ''}
              />
              %
            </Box>
          </OptionCustom>
        </Box>
        {!!slippageError && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            style={{
              fontSize: '14px',
              paddingTop: '7px',
              color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? 'Enter a valid slippage percentage'
              : slippageError === SlippageError.RiskyLow
              ? 'Your transaction may fail'
              : 'Your transaction may be frontrun'}
          </Box>
        )}
      </Box>

      {!onlySlippage && (
        <Box display="grid" gap="8px">
          <Box display="flex" alignItems="center">
            <Typography fontSize={14} fontWeight={400} color={theme.textColor.text2}>
              Transaction deadline
            </Typography>
            <QuestionHelper text="Your transaction will revert if it is pending for more than this long." />
          </Box>
          <Box display="flex" alignItems="center">
            <OptionCustom style={{ width: '10rem', marginRight: '12px' }} tabIndex={-1}>
              <Input
                color={!!deadlineError ? 'red' : undefined}
                onBlur={() => {
                  parseCustomDeadline((deadline / 60).toString())
                }}
                placeholder={(deadline / 60).toString()}
                value={deadlineInput}
                onChange={e => parseCustomDeadline(e.target.value)}
              />
            </OptionCustom>
            <Typography style={{ paddingLeft: '8px' }} fontSize={14}>
              minutes
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
