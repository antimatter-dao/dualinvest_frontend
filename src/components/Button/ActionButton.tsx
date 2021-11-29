import Button from './Button'
import OutlineButton from './OutlineButton'
import Spinner from 'components/Spinner'
import { Typography, useTheme } from '@mui/material'

export default function ActionButton({
  error,
  pending,
  success,
  onAction,
  actionText,
  pendingText,
  height,
  width,
  disableAction,
  successText
}: {
  error?: string | undefined
  pending?: boolean
  success?: boolean
  onAction: (() => void) | undefined
  actionText: string
  pendingText?: string
  successText?: string
  height?: string
  width?: string
  disableAction?: boolean
}) {
  const theme = useTheme()
  return (
    <>
      {error ? (
        <OutlineButton primary disabled height={height} width={width}>
          {error}
        </OutlineButton>
      ) : pending ? (
        <Button
          disabled
          height={height}
          width={width}
          style={{ backgroundColor: theme.palette.primary.main + '!important' }}
        >
          <Spinner marginRight={16} color="#ffffff" />
          {pendingText || 'Waiting Confirmation'}
        </Button>
      ) : success ? (
        <Button disabled height={height} width={width}>
          <Typography variant="inherit">{successText ?? actionText}</Typography>
        </Button>
      ) : (
        <Button height={height} width={width} onClick={onAction} disabled={disableAction}>
          {actionText}
        </Button>
      )}
    </>
  )
}
