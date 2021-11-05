import React from 'react'
import { ButtonBase, useTheme } from '@mui/material'
interface Props {
  onClick?: (e?: any) => void
  children: React.ReactNode
  fontSize?: string | number
  fontWeight?: number
  primary?: boolean
  underline?: boolean
  opacity?: number
  style?: React.CSSProperties
  disabled?: boolean
  classname?: string
}

export default function TextButton(props: Props) {
  const { onClick, style, disabled, underline, primary, fontSize, fontWeight, opacity } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      style={style}
      disabled={disabled}
      sx={{
        textDecoration: underline ? 'underline' : 'none',
        color: primary ? theme.palette.primary.main : theme.palette.primary.contrastText,
        fontSize: fontSize || 16,
        fontWeight: fontWeight || 500,
        opacity: opacity || 1,
        '&:hover': {
          opacity: 1,
          color: primary ? theme.palette.primary.dark : theme.palette.primary.main
        }
      }}
    >
      {props.children}
    </ButtonBase>
  )
}
