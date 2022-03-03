import { Paper, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React from 'react'

export default function Card({
  children,
  color,
  padding,
  width,
  style,
  gray,
  primary,
  height
}: {
  children?: React.ReactNode
  color?: string
  padding?: string | number
  width?: string | number
  style?: React.CSSProperties & SxProps<Theme>
  gray?: boolean
  primary?: boolean
  height?: string | number
}) {
  return (
    <Paper
      sx={{
        background: theme =>
          primary ? theme.gradient.gradient1 : gray ? theme.palette.background.default : color ?? '#ffffff',
        borderRadius: '20px',
        boxShadow: 'none',
        padding,
        width,
        height,
        ...style
      }}
    >
      {children}
    </Paper>
  )
}

export function OutlinedCard({
  children,
  color,
  padding,
  width,
  style
}: {
  children: JSX.Element | React.ReactNode
  color?: string
  padding?: string | number
  width?: string | number
  style?: React.CSSProperties & SxProps<Theme>
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: 'transparent',
        border: `1px solid ${color ?? 'rgba(0, 0, 0, 0.1)'}`,
        padding,
        width,
        ...style
      }}
    >
      {children}
    </Paper>
  )
}
