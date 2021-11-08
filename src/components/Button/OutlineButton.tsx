import React from 'react'
import { ButtonBase, useTheme } from '@mui/material'

interface Props {
  onClick?: (() => void) | null
  primary?: boolean
  children: React.ReactNode
  width?: string | number
  height?: string | number
  fontSize?: string | number
  disabled?: boolean
  color?: string
  borderRadius?: string
  style?: React.CSSProperties
}

export default function OutlineButton(props: Props) {
  const { onClick, disabled, style, width, fontSize, color, primary, height, borderRadius, children } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick ?? undefined}
      disabled={disabled}
      sx={{
        width: width || '100%',
        border: theme =>
          `1px solid ${color ? color : primary ? theme.palette.primary.main : theme.palette.text.secondary}`,
        fontSize: fontSize,
        fontWeight: primary ? '500' : '400',
        height: height || 60,
        color: primary ? theme.palette.primary.main : theme.palette.primary.contrastText,
        borderRadius: borderRadius ?? 1,
        '&:hover': {
          color: primary ? theme.palette.primary.dark : theme.palette.primary.contrastText,
          borderColor: primary ? theme.palette.primary.dark : theme.palette.primary.main
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity
        },
        ...style
      }}
    >
      {children}
    </ButtonBase>
  )
}
