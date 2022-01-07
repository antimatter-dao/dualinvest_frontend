import React from 'react'
import { ButtonBase, useTheme, Theme } from '@mui/material'
import { SxProps } from '@mui/system'

export default function TabButton({
  onClick,
  disabled,
  fontSize,
  children,
  variant,
  active,
  sx
}: {
  onClick?: () => void
  background?: string
  disabled?: boolean
  color?: string
  children?: React.ReactNode
  fontSize?: string | number
  outlined?: boolean
  variant?: 'primary' | 'secondary' | 'outlined'
  active?: boolean
  sx?: React.CSSProperties & SxProps<Theme>
}) {
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        padding: '12px 26px',
        width: 'max-content',
        borderRadius: '10px',
        fontWeight: 400,
        height: 'max-content',
        fontSize: fontSize || 16,
        backgroundColor: theme.palette.background.paper,
        color: active ? theme.palette.text.primary : theme.palette.text.secondary,
        border: '1px solid transparent',
        borderColor: active ? theme.palette.primary.main : 'transparent',
        transition: '.3s',
        '&:hover': {
          borderColor: active ? theme.palette.primary.dark : 'transparent',
          backgroundColor:
            variant === 'outlined'
              ? 'transparent'
              : variant === 'secondary'
              ? theme.palette.secondary.dark
              : theme.palette.primary.dark
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity,
          backgroundColor: theme.palette.primary.light,
          color: '#464647'
        },
        ...sx
      }}
    >
      {children}
    </ButtonBase>
  )
}
