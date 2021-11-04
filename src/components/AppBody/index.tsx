import React from 'react'
import { IconButton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
  children: React.ReactNode
  width?: number | string
  onReturnClick?: () => void
  title?: string
  maxWidth?: string
  closeIcon?: boolean
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: (props: Partial<Props>) => props.width || 560,
    maxWidth: (props: Partial<Props>) => props.maxWidth || 560,
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
  closeIconContainer: {
    padding: 0,
    position: 'absolute',
    top: 24,
    right: 24,
    '&:hover $closeIcon': {
      color: theme.palette.text.primary
    }
  },
  closeIcon: {
    color: theme.palette.grey[500]
  }
}))

export default function AppBody({ children, closeIcon, onReturnClick, ...props }: Props) {
  const classes = useStyles(props)

  return (
    <div className={classes.root}>
      {closeIcon && (
        <IconButton className={classes.closeIconContainer} onClick={onReturnClick} size="large">
          <CloseIcon className={classes.closeIcon} />
        </IconButton>
      )}
      {children}
    </div>
  )
}
