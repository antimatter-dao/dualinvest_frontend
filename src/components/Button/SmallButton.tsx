import React from 'react'
import { ButtonBase, useTheme } from '@mui/material'

interface Props {
  onClick?: () => void
  background?: string
  disabled?: boolean
  color?: string
  children?: React.ReactNode
  fontSize?: string | number
}

export default function SmallButton(props: Props) {
  const { onClick, disabled, fontSize, children } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        padding: '5px 8px',
        minWidth: 56,
        height: 'max-content',
        fontSize: fontSize || 14,
        backgroundColor: theme.palette.grey.A200,
        color: theme.palette.primary.contrastText,
        fontWeight: 500,
        borderRadius: '14px',
        transition: '.3s',
        '&:hover': {
          color: theme.palette.primary.main
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity,
          backgroundColor: theme.palette.primary.light,
          color: '#464647'
        }
      }}
    >
      {children}
    </ButtonBase>
  )
}
