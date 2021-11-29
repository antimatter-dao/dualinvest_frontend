import { ChangeEvent, useCallback } from 'react'
import { styled, Box, useTheme, Typography } from '@mui/material'
import InputNumerical from 'components/Input/InputNumerical'
import OutlineButton from 'components/Button/OutlineButton'
import InputLabel from 'components/Input/InputLabel'
import SelectButton from 'components/Button/SelectButton'
import useModal from 'hooks/useModal'
import LogoText from 'components/LogoText'
import { HideOnMobile, ShowOnMobile } from 'theme/index'
import SelectCurrencyModal from './SelectCurrencyModal'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Currency } from 'constants/token/currency'
import CurrencyLogo from 'components/essential/CurrencyLogo'

interface Props {
  currency?: Currency | null
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onMax?: () => void
  disabled?: boolean
  placeholder?: string
  selectActive?: boolean
  inputFocused?: boolean
  disableCurrencySelect?: boolean
  customBalanceText?: string
  hideBalance?: boolean
  onSelectCurrency: (cur: Currency) => void
}

const InputRow = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '44px',
  display: 'flex',
  justifyContent: 'flex-end',
  '& .Mui-focused': {
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 'calc(100% + 2px)',
      height: 'calc(100% + 2px)',
      borderRadius: 14,
      margin: -1,
      border: '1px solid ' + theme.palette.primary.main,
      zIndex: 10000
    }
  }
}))

const StyledInput = styled(InputNumerical)({
  position: 'absolute'
})

const ButtonWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: 196,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    right: 20
  }
}))

export default function CurrencyInputPanel({
  onMax,
  value,
  disabled,
  placeholder,
  selectActive,
  inputFocused,
  disableCurrencySelect,
  currency,
  onSelectCurrency,
  customBalanceText,
  hideBalance,
  onChange
}: Props) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { showModal } = useModal()
  const theme = useTheme()

  const showCurrencySearch = useCallback(() => {
    if (!disableCurrencySelect) {
      showModal(<SelectCurrencyModal onSelectCurrency={onSelectCurrency} />)
    }
  }, [disableCurrencySelect, onSelectCurrency, showModal])

  return (
    <Box display="grid" gap="24px">
      <ShowOnMobile breakpoint={'sm'}>
        <InputLabel>Token</InputLabel>
        <SelectButton width={'180px'} onClick={showCurrencySearch} disabled={disabled} primary={selectActive}>
          {currency ? (
            <LogoText logo={<CurrencyLogo currency={currency} />} text={currency.symbol} />
          ) : (
            <>Select Token</>
          )}
        </SelectButton>
      </ShowOnMobile>
      <div>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <InputLabel>Amount</InputLabel>
          {currency && (
            <Typography color={theme.textColor.text3} fontWeight={500} fontSize={14}>
              {!hideBalance && !!currency && selectedCurrencyBalance
                ? (customBalanceText ?? 'Your balance: ') + selectedCurrencyBalance?.toSignificant(6)
                : ' -'}
            </Typography>
          )}
        </Box>
        <InputRow>
          <StyledInput
            placeholder={placeholder ?? 'Enter amount to swap'}
            value={value.toString()}
            onChange={onChange}
            type={'number'}
            disabled={disabled}
            focused={inputFocused}
          />
          {currency && onMax && (
            <ButtonWrapper>
              <OutlineButton
                width="64px"
                height="28px"
                onClick={onMax}
                color={theme.textColor.text1}
                borderRadius="20px"
              >
                Max
              </OutlineButton>
            </ButtonWrapper>
          )}
          <HideOnMobile breakpoint={'sm'}>
            <SelectButton width={'180px'} onClick={showCurrencySearch} disabled={disabled} primary={selectActive}>
              {currency ? (
                <LogoText logo={<CurrencyLogo currency={currency} />} text={currency.symbol} />
              ) : (
                <>Select Token</>
              )}
            </SelectButton>
          </HideOnMobile>
        </InputRow>
      </div>
    </Box>
  )
}
