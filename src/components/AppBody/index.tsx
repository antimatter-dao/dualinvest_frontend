import React from 'react'
import { styled } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const PREFIX = 'index'

const classes = {
  root: `${PREFIX}-root`,
  closeIconContainer: `${PREFIX}-closeIconContainer`,
  closeIcon: `${PREFIX}-closeIcon`
}

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
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
  },

  [`& .${classes.closeIconContainer}`]: {
    padding: 0,
    position: 'absolute',
    top: 24,
    right: 24,
    '&:hover $closeIcon': {
      color: theme.palette.text.primary
    }
  },

  [`& .${classes.closeIcon}`]: {
    color: theme.palette.grey[500]
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
      className={classes.root}
      sx={{
        width: width || 560,
        maxWidth: maxWidth || 560
      }}
    >
      {closeIcon && (
        <IconButton className={classes.closeIconContainer} onClick={onReturnClick} size="large">
          <CloseIcon className={classes.closeIcon} />
        </IconButton>
      )}
      {children}
    </Root>
  )
}
