import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { InputBase, styled } from '@mui/material'
import { inputBaseClasses } from '@mui/material/InputBase'
import InputLabel from './InputLabel'

export interface InputProps {
  placeholder?: string
  value: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  focused?: boolean
  outlined?: boolean
  type?: string
  endAdornment?: React.ReactNode
  maxWidth?: string | number
  height?: string | number
  error?: boolean
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  [`&.${inputBaseClasses.root}`]: {
    fontSize: 16,
    color: theme.palette.text.primary,
    fontFamily: 'SF Pro',
    fontWeight: 400,
    backgroundColor: theme.palette.background.default,
    paddingLeft: 20,
    borderRadius: 14
  },
  [`&.${inputBaseClasses.focused}`]: { border: `1px solid ${theme.palette.primary.main} !important` },
  [`& .${inputBaseClasses.input}`]: {
    '&::-webkit-outer-spin-button': {
      WebkitAppearance: 'none'
    },
    '&::-webkit-inner-spin-button': {
      WebkitAppearance: 'none'
    }
  },
  [`&.${inputBaseClasses.disabled}`]: {
    color: 'rgba(255,255,255,0.24)',
    cursor: 'not-allowed',
    backgroundColor: theme.palette.grey.A400
  }
}))

export default function Input({
  focused,
  placeholder,
  onChange,
  value,
  disabled,
  type,
  outlined,
  endAdornment,
  maxWidth,
  label,
  height,
  error,
  ...rest
}: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'outline' | 'size'>) {
  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInputBase
        sx={{
          height: height || 60,
          [`&.${inputBaseClasses.root}`]: {
            border: theme =>
              `1px solid ${outlined ? 'rgba(255,255,255,.4)' : error ? theme.palette.primary.main : 'transparent'}`
          },
          [`&.${inputBaseClasses.focused}`]: {
            borderColor: theme =>
              error ? `${theme.palette.error.main}!important` : `${theme.palette.primary.main}!important`
          }
        }}
        color={error ? 'error' : 'primary'}
        fullWidth={true}
        placeholder={placeholder}
        inputRef={input => input && focused && input.focus()}
        onChange={onChange}
        value={value}
        disabled={disabled}
        type={type}
        endAdornment={endAdornment && <span style={{ paddingRight: 20 }}>{endAdornment}</span>}
        {...rest}
      />
    </div>
  )
}
