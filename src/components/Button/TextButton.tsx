import React from 'react'
import { ButtonBase, Theme, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'

export default function TextButton({
  onClick,
  style,
  disabled,
  underline,
  primary,
  fontSize,
  fontWeight,
  opacity,
  color,
  children
}: {
  onClick?: (e?: any) => void
  children: React.ReactNode
  fontSize?: string | number
  fontWeight?: number
  primary?: boolean
  underline?: boolean
  opacity?: number
  style?: React.CSSProperties | SxProps<Theme>
  disabled?: boolean
  classname?: string
  color?: string
}) {
  const theme = useTheme()

  return (
    <ButtonBase
      disableRipple
      onClick={onClick}
      disabled={disabled}
      sx={{
        textDecoration: underline ? 'underline' : 'none',
        color: color ?? primary ? theme.palette.primary.main : theme.palette.text.primary,
        fontSize: fontSize || 16,
        fontWeight: fontWeight || 500,
        opacity: opacity || 1,
        '&:hover': {
          opacity: 1,
          color: primary ? theme.palette.primary.light : theme.palette.primary.main
        },
        ...style
      }}
    >
      {children}
    </ButtonBase>
  )
}
