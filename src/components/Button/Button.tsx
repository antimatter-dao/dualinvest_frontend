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
  active?: boolean
}

export default function Button(props: Props) {
  const { onClick, disabled, style, width, height, fontSize, backgroundColor, color } = props
  const theme = useTheme()
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: width || '100%',
        height: height || 60,
        fontSize: fontSize || 16,
        fontWeight: 500,
        transition: '.3s',
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor: backgroundColor || theme.palette.primary.main,
        color: color || theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark
        },
        '&:disabled': {
          backgroundColor: theme.palette.primary.light
        },
        ...style
      }}
    >
      {props.children}
    </ButtonBase>
  )
}

export function BlackButton({ style, ...props }: Props) {
  const theme = useTheme()
  return (
    <Button
      {...props}
      style={{
        backgroundColor: theme.palette.text.primary,
        '&:hover': {
          background: '#515151'
        },
        '&:disabled': {
          backgroundColor: '#B9B9B9'
        },
        ...style
      }}
    />
  )
}

export function DefaultButton({ style, active, ...props }: Props) {
  const theme = useTheme()

  return (
    <Button
      {...props}
      style={{
        color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
        backgroundColor: active ? theme.palette.primary.main : theme.palette.primary.contrastText,
        border: `1px solid ${active ? 'transparent' : 'rgba(0,0,0,0.1)'}`,
        '&:hover': {
          background: theme.palette.primary.main
        },
        ...style
      }}
    />
  )
}
