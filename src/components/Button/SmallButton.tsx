import React from 'react'
import { ButtonBase, useTheme, Theme } from '@mui/material'
import { SxProps } from '@mui/system'

export default function SmallButton({
  onClick,
  disabled,
  fontSize,
  children,
  variant,
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
  sx?: React.CSSProperties & SxProps<Theme>
}) {
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        padding: '10px 19px',
        width: 'max-content',
        borderRadius: '40px',
        fontWeight: 400,
        height: 'max-content',
        fontSize: fontSize || 14,
        backgroundColor:
          variant === 'outlined'
            ? 'transparent'
            : variant === 'secondary'
            ? theme.palette.secondary.main
            : theme.palette.primary.main,
        color:
          variant === 'outlined'
            ? theme.palette.primary.main
            : variant === 'secondary'
            ? theme.palette.secondary.light
            : theme.palette.primary.contrastText,
        border: '1px solid transparent',
        borderColor: variant === 'outlined' ? theme.palette.primary.main : 'transparent',
        transition: '.3s',
        '&:hover': {
          color:
            variant === 'outlined'
              ? theme.palette.primary.main
              : variant === 'secondary'
              ? theme.palette.secondary.main
              : theme.palette.primary.contrastText,
          borderColor: variant === 'outlined' ? theme.palette.primary.dark : 'transparent',
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
