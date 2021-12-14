import { CircularProgress } from '@mui/material'
import React from 'react'

export default function Spinner({
  size = 16,
  thickness = 3,
  marginLeft,
  marginRight,
  style,
  color
}: {
  size?: string | number
  thickness?: number
  color?: string
  marginLeft?: string | number
  marginRight?: string | number
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        position: 'relative',
        marginLeft: marginLeft ?? 0,
        marginRight: marginRight ?? 0,
        height: size,
        width: size,
        ...style
      }}
    >
      <CircularProgress
        variant="determinate"
        sx={{
          '& svg circle': {
            stroke: theme => theme.palette.background.default
          }
        }}
        thickness={thickness - 1}
        size={size}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: theme => color ?? theme.palette.primary.main,
          animationDuration: '850ms',
          position: 'absolute',
          left: 0,
          top: 0
        }}
        thickness={thickness}
        size={size}
      />
    </div>
  )
}
