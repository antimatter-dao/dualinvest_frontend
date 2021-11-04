import { Paper, useTheme } from '@material-ui/core'
import React from 'react'

export function OutlinedCard({
  children,
  color,
  classname,
  padding,
  width,
  style
}: {
  children: JSX.Element
  color?: string
  classname?: string
  padding?: string | number
  width?: string | number
  style?: React.CSSProperties
}) {
  const theme = useTheme()

  return (
    <Paper
      variant="outlined"
      style={{
        backgroundColor: 'transparent',
        border: `1px solid ${color ?? theme.palette.grey.A400}`,
        padding,
        width,
        ...style
      }}
      classes={{ root: classname }}
    >
      {children}
    </Paper>
  )
}
