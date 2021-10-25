import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { InputBase, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/styles'
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
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 16,
      color: '#FFFFFF',
      fontFamily: 'Roboto',
      fontWeight: 400,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      height: 48,
      paddingLeft: 20,
      borderRadius: 14,
      border: (props: InputProps) => `1px solid ${props.outlined ? 'rgba(255,255,255,.4)' : 'transparent'}`
    },
    focused: {
      border: `1px solid ${theme.palette.primary.main} !important`
    },
    input: {
      '&::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none'
      },
      '&::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none'
      }
    },
    disabled: {
      color: 'rgba(255,255,255,0.24)',
      cursor: 'not-allowed',
      backgroundColor: theme.palette.grey.A400
    },
    formControl: {
      width: '100%',
      maxWidth: (props: InputProps) => props.maxWidth || 'unset'
    }
  })
)

export default function Input(props: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'outline'>) {
  const classes = useStyles(props)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { focused, placeholder, onChange, value, disabled, type, outlined, endAdornment, maxWidth, ...rest } = props

  return (
    <div className={classes.formControl}>
      {props.label && <InputLabel>{props.label}</InputLabel>}
      <InputBase
        fullWidth={true}
        placeholder={placeholder}
        classes={{ ...classes }}
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
