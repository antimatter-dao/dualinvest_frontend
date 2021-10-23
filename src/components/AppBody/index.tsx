import React from 'react'
import { X } from 'react-feather'
import { Box, makeStyles, Typography } from '@material-ui/core'
import TextButton from 'components/Button/TextButton'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'

interface Props {
  children: React.ReactNode
  width?: number
  onReturnClick?: () => void
  title?: string
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: (props: { width?: number }) => props.width || 560,
    borderRadius: 20,
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%), #000000',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxSizing: 'border-box',
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%!important'
    }
  },
  box: {
    padding: '20px 40px',
    [theme.breakpoints.down('sm')]: {
      padding: 20
    }
  }
}))

export default function AppBody({ onReturnClick, title, children, ...props }: Props) {
  const classes = useStyles(props)
  const { matches } = useBreakpoint()

  return (
    <div className={classes.root}>
      {(onReturnClick || title) && (
        <Box display="flex" justifyContent="space-between" className={classes.box}>
          {onReturnClick && !matches && (
            <TextButton onClick={onReturnClick}>
              <ArrowLeft />
            </TextButton>
          )}

          {title && <Typography variant="h6">{title}</Typography>}

          {onReturnClick && matches ? (
            <TextButton onClick={onReturnClick}>
              <X />
            </TextButton>
          ) : (
            <div />
          )}
        </Box>
      )}
      {children}
    </div>
  )
}
