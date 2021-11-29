import { useCallback, useEffect } from 'react'
import { useSpring } from 'react-spring/web'
import { styled } from '@mui/material'
import { animated } from 'react-spring'
import { useRemovePopup } from 'state/application/hooks'
import TransactionPopup from './TransactionPopup'
import { CloseIcon } from 'theme/components'

export const Popup = styled('div')(({ theme }) => ({
  display: 'inlineBlock',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid ' + theme.palette.primary.main,
  position: 'relative',
  borderRadius: '4px',
  padding: '20px',
  paddingRight: '35px',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    minWidth: '290px',
    '&:not(:last-of-type)': {
      marginRight: '20px'
    }
  }
}))

const Fader = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '0px',
  left: '0px',
  width: '100%',
  height: '2px',
  backgroundColor: theme.palette.primary.main
}))

const AnimatedFader = animated(Fader)

export default function PopupItem({
  removeAfterMs,
  content,
  popKey
}: {
  removeAfterMs: number | null
  content: any
  popKey: string
}) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removeThisPopup()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, removeThisPopup])

  let popupContent
  if ('txn' in content) {
    const {
      txn: { hash, success, summary }
    } = content
    popupContent = <TransactionPopup hash={hash} success={success} summary={summary} />
  }

  const faderStyle = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: removeAfterMs ?? undefined }
  })

  return (
    <Popup>
      <CloseIcon onClick={removeThisPopup} />
      {popupContent}
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
    </Popup>
  )
}
