import { Paper, useTheme } from '@mui/material'
import React from 'react'

export function OutlinedCard({
  children,
  color,
  padding,
  width,
  style
}: {
  children: JSX.Element
  color?: string
  padding?: string | number
  width?: string | number
  style?: React.CSSProperties
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
