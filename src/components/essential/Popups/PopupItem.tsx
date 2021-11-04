import { useCallback, useEffect } from 'react'
import { useSpring } from 'react-spring/web'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core'
import { animated } from 'react-spring'
import { useRemovePopup } from 'state/application/hooks'
import TransactionPopup from './TransactionPopup'

export const Popup = styled.div`
  display: inline-block;
  width: 100%;
  padding: 1em;
  background-color: ${({ theme }) => theme.bg1};
  position: relative;
  border-radius: 4px;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 290px;
    &:not(:last-of-type) {
      margin-right: 20px;
    }
  `}
`
const Fader = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.bg5};
`

const AnimatedFader = animated(Fader)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

export default function PopupItem({
  removeAfterMs,
  content,
  popKey
}: {
  removeAfterMs: number | null
  content: any
  popKey: string
}) {
  const classes = useStyles()
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
      <IconButton className={classes.closeIconContainer} onClick={removeThisPopup}>
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
      {popupContent}
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
    </Popup>
  )
}
