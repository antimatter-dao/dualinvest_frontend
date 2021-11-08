import { Placement } from '@popperjs/core'
import React, { useCallback, useState } from 'react'
import { usePopper } from 'react-popper'
import { styled } from '@mui/material'
import useInterval from '../../../hooks/useInterval'
import Portal from '@reach/portal'

const PopoverContainer = styled('div')(({ theme }) => ({
  zIndex: 9999,
  transition: 'visibility 150ms linear, opacity 150ms linear',
  background: theme.bgColor.bg2,
  border: '1px solid ' + theme.bgColor.bg3,
  boxShadow: '0 4px 8px 0 ' + theme.bgColor.bg2,
  color: theme.textColor.text2,
  borderRadius: ' 8px'
}))

const ReferenceElement = styled('div')({
  display: 'inline-block'
})

const Arrow = styled('div')(({ theme }) => ({
  width: '8px',
  height: '8px',
  zIndex: 9998,
  '&:before': {
    position: ' absolute',
    width: '8px',
    height: '8px',
    zIndex: 9998,
    content: '',
    border: '1px solid ' + theme.bgColor.bg3,
    transform: 'rotate(45deg)',
    background: theme.bgColor.bg2
  },
  '&.arrow-top': {
    bottom: '-5px',
    '&:before': {
      borderTop: 'none',
      borderLeft: 'none'
    }
  },
  '&.arrow-bottom': {
    top: '-5px',
    '&:before': {
      borderTop: 'none',
      borderLeft: 'none'
    }
  },

  '&.arrow-left': {
    right: '-5px',

    '&:before': {
      borderTop: 'none',
      borderLeft: 'none'
    }
  },
  '&.arrow-right': {
    left: '-5px',
    '&:before': {
      borderTop: 'none',
      borderLeft: 'none'
    }
  }
}))

export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  children: React.ReactNode
  placement?: Placement
}

export default function Popover({ content, show, children, placement = 'auto' }: PopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
      { name: 'arrow', options: { element: arrowElement } }
    ]
  })
  const updateCallback = useCallback(() => {
    update && update()
  }, [update])
  useInterval(updateCallback, show ? 100 : null)

  return (
    <>
      <ReferenceElement ref={setReferenceElement as any}>{children}</ReferenceElement>
      <Portal>
        <PopoverContainer
          ref={setPopperElement as any}
          style={styles.popper}
          {...attributes.popper}
          sx={{
            visibility: show ? 'visible' : 'hidden',
            opacity: show ? 1 : 0
          }}
        >
          {content}
          <Arrow
            className={`arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
            ref={setArrowElement as any}
            style={styles.arrow}
            {...attributes.arrow}
          />
        </PopoverContainer>
      </Portal>
    </>
  )
}
