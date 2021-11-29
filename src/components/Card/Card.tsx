import { Paper, useTheme, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React from 'react'

export default function Card({
  children,
  color,
  padding,
  width,
  style,
  gray,
  primary
}: {
  children?: React.ReactNode
  color?: string
  padding?: string | number
  width?: string | number
  style?: React.CSSProperties & SxProps<Theme>
  gray?: boolean
  primary?: boolean
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
  const theme = useTheme()

  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: 'transparent',
        border: `1px solid ${color ?? theme.palette.grey.A400}`,
        padding,
        width,
        ...style
      }}
    >
      {children}
    </Paper>
  )
}
