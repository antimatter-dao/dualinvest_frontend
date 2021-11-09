import React from 'react'
import { ButtonBase, Theme, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'

interface Props {
  onClick?: () => void
  width?: string
  height?: string
  backgroundColor?: string
  disabled?: boolean
  color?: string
  children?: React.ReactNode
  fontSize?: string | number
  classname?: string
  style?: React.CSSProperties & SxProps<Theme>
}

export default function Button(props: Props) {
  const { onClick, disabled, style, width, height, fontSize, backgroundColor, color } = props
  const theme = useTheme()
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        ...style,
        width: width || '100%',
        height: height || 60,
        fontSize: fontSize || 16,
        fontWeight: 500,
        transition: '.3s',
        borderRadius: 1,
        backgroundColor: backgroundColor || theme.palette.primary.main,
        color: color || theme.palette.primary.contrastText,
        '&:hover': {
          background: theme.palette.primary.dark
        },
        '&:disabled': {
          opacity: 0.24,
          backgroundColor: theme.palette.primary.dark,
          color: '#464647'
        }
      }}
    >
      {props.children}
    </ButtonBase>
  )
}
