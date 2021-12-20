import React from 'react'
import { Dialog, useTheme } from '@mui/material'
import useModal from 'hooks/useModal'
import { useRef } from 'react'
import { CloseIcon } from 'theme/components'

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
  background?: string
  backdropColor?: string
}

export default function Modal(props: Props) {
  const {
    children,
    closeIcon,
    isCardOnMobile,
    customIsOpen,
    customOnDismiss,
    hasBorder = true,
    width,
    maxWidth,
    padding,
    background,
    backdropColor
  } = props
  const { isOpen, hideModal } = useModal()
  const node = useRef<any>()
  const theme = useTheme()
  const hide = customOnDismiss ? customOnDismiss : hideModal

  return (
    <>
      <Dialog
        open={customIsOpen !== undefined ? !!customIsOpen : isOpen}
        sx={{
          '& *': {
            boxSizing: 'border-box'
          },
          '& .MuiDialog-container ': {
            alignItems: { xs: !isCardOnMobile ? 'flex-end' : 'center', sm: 'center' }
          }
        }}
        PaperProps={{
          ref: node,
          sx: {
            ...{
              width: { xs: 'calc(100vw - 32px)!important', sm: width || 488 },
              maxWidth: maxWidth || 488,
              background: theme => background ?? theme.palette.background.paper,
              border: hasBorder ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
              boxShadow: 'unset',
              padding: padding || 0,
              boxSizing: 'border-box',
              borderRadius: 2,
              marginBottom: { xs: 0, sm: 100 },
              overflowX: 'hidden',
              position: 'absolute',
              overflowY: 'auto',
              maxHeight: theme => `calc(100vh - ${theme.height.header})`
            },
            ...(!isCardOnMobile
              ? {
                  [theme.breakpoints.down('sm')]: {
                    margin: 0,
                    border: 'none',
                    width: '100%!important',
                    maxWidth: 'unset!important',
                    maxHeight: `calc(100vh - ${theme.height.mobileHeader})`,
                    height: 'auto',
                    borderRadius: '0',
                    marginTop: theme.height.mobileHeader,
                    marginBottom: 0,
                    pb: '50px',
                    pt: '10px'
                  }
                }
              : { [theme.breakpoints.down('sm')]: { margin: 0, pb: '20px', borderRadius: '0' } })
          }
        }}
        BackdropProps={{
          sx: {
            ...{
              backgroundColor: backdropColor || 'rgba(0,0,0,0.6)',
              [theme.breakpoints.down('sm')]: { top: theme.height.mobileHeader }
            }
          }
        }}
        onClose={hide}
      >
        {closeIcon && <CloseIcon onClick={hide} />}
        {children}
      </Dialog>
    </>
  )
}
