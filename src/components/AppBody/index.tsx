import React from 'react'
import { styled } from '@mui/material/styles'
import { CloseIcon } from 'theme/components'

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%), #000000',
  justifyContent: 'center',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxSizing: 'border-box',
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '100%!important',
    maxWidth: 'unset'
  }
}))

interface Props {
  children: React.ReactNode
  width?: number | string
  onReturnClick?: () => void
  title?: string
  maxWidth?: string
  closeIcon?: boolean
}

export default function AppBody(props: Props) {
  const { children, closeIcon, onReturnClick, width, maxWidth } = props

  return (
    <Root
      sx={{
        width: width || 560,
        maxWidth: maxWidth || 560
      }}
    >
      {closeIcon && <CloseIcon onClick={onReturnClick} />}
      {children}
    </Root>
  )
}
