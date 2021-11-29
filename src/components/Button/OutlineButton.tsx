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
        border: theme => `1px solid ${color ? color : primary ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.1)'}`,
        fontSize: fontSize,
        height: height || 60,
        color: primary ? theme.palette.primary.main : theme.palette.text.primary,
        borderRadius: borderRadius ?? 1,
        '&:hover': {
          color: primary ? '#6FC87E' : theme.palette.text.primary,
          borderColor: primary ? '#6FC87E' : theme.palette.text.secondary
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
