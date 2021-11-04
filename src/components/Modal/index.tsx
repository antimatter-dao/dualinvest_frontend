import React from 'react'
import { Dialog, makeStyles, Theme, IconButton, createStyles } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import useModal from 'hooks/useModal'
import { useRef } from 'react'
import clsx from 'clsx'

interface Props {
  children?: React.ReactNode
  closeIcon?: boolean
  width?: string
  maxWidth?: string
  isCardOnMobile?: boolean
  customIsOpen?: boolean
  customOnDismiss?: () => void
  padding?: string
  hasBorder?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& *': {
        boxSizing: 'border-box'
      },
      paddingTop: theme.height.header,
      [theme.breakpoints.down('sm')]: {
        height: `calc(100% - ${theme.height.mobileHeader})`,
        marginTop: 'auto'
      }
    },
    mobileRoot: {
      '& .MuiDialog-scrollPaper': {
        [theme.breakpoints.down('sm')]: {
          alignItems: 'flex-end'
        }
      }
    },
    paper: {
      width: (props: Props) => props.width || 480,
      maxWidth: (props: Props) => props.maxWidth || 480,
      background: theme.gradient.gradient1,
      border: (props: Props) => (props.hasBorder ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'),
      padding: (props: Props) => props.padding || 0,
      boxSizing: 'border-box',
      borderRadius: 20,
      marginBottom: 100,
      overflowX: 'hidden',
      position: 'absolute',
      overflowY: 'auto',
      maxHeight: `calc(100vh - ${theme.height.header})`,
      [theme.breakpoints.down('sm')]: {
        maxHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
        width: 'calc(100% - 32px)!important',
        marginBottom: '32px'
      }
    },
    mobilePaper: {
      [theme.breakpoints.down('sm')]: {
        border: 'none',
        borderTop: '1px solid ' + theme.palette.grey.A200,
        width: '100%!important',
        maxWidth: 'unset!important',
        maxHeight: 'unset',
        height: `calc(100vh - ${theme.height.mobileHeader})`,
        margin: 0,
        borderRadius: '20px 20px 0 0',
        paddingBottom: theme.height.header
      }
    },
    backdrop: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      opacity: 0.4
    },
    mobileBackdrop: {
      [theme.breakpoints.down('sm')]: {
        background: 'none'
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
  })
)

export default function Modal(props: Props) {
  const { children, closeIcon, isCardOnMobile, customIsOpen, customOnDismiss, hasBorder = true } = props
  const classes = useStyles({ ...props, hasBorder })
  const { isOpen, hideModal } = useModal()
  const node = useRef<any>()
  const hide = customOnDismiss ? customOnDismiss : hideModal

  return (
    <>
      <Dialog
        open={customIsOpen !== undefined ? !!customIsOpen : isOpen}
        className={clsx(classes.root, !isCardOnMobile && classes.mobileRoot)}
        PaperProps={{ className: clsx(classes.paper, !isCardOnMobile && classes.mobilePaper), ref: node }}
        BackdropProps={{ className: clsx(classes.backdrop, !isCardOnMobile && classes.mobileBackdrop) }}
        onClose={hide}
      >
        {closeIcon && (
          <IconButton className={classes.closeIconContainer} onClick={hide}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
        )}
        {children}
      </Dialog>
    </>
  )
}
