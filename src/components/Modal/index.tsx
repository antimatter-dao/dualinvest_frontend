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
    padding
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
            boxSizing: 'border-box',
            '& .MuiDialog-scrollPaper': {
              alignItems: !isCardOnMobile ? { mdDown: 'flex-end' } : {}
            }
          }
        }}
        PaperProps={{
          ref: node,
          sx: {
            ...{
              width: { xs: 'calc(100vw - 32px)!important', md: width || 480 },
              maxWidth: maxWidth || 480,
              background: theme => theme.gradient.gradient1,
              border: hasBorder ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
              padding: padding || 0,
              boxSizing: 'border-box',
              borderRadius: 2,
              marginBottom: { xs: '32px', md: 100 },
              overflowX: 'hidden',
              position: 'absolute',
              overflowY: 'auto',
              maxHeight: theme => ({
                xs: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
                md: `calc(100vh - ${theme.height.header})`
              })
            },
            ...(!isCardOnMobile
              ? {
                  [theme.breakpoints.down('md')]: {
                    border: 'none',
                    borderTop: '1px solid ' + theme.palette.grey.A200,
                    borderBottom: '1px solid ' + theme.palette.grey.A200,
                    width: '100%!important',
                    maxWidth: 'unset!important',
                    maxHeight: 'unset',
                    height: `calc(100vh - ${theme.height.mobileHeader} - ${theme.height.header})`,
                    margin: theme.height.header,
                    borderRadius: '20px 20px 0 0'
                  }
                }
              : {})
          }
        }}
        BackdropProps={{
          sx: {
            ...{
              backgroundColor: 'rgba(0,0,0,0.7)',
              opacity: 0.4
            },
            ...(!isCardOnMobile
              ? {
                  [theme.breakpoints.down('md')]: {
                    background: 'none'
                  }
                }
              : {})
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
