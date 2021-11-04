import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ReactComponent as CopyIcon } from 'assets/componentsIcon/copy_icon.svg'
import CheckIcon from '@material-ui/icons/Check'
import useCopyClipboard from 'hooks/useCopyClipboard'

interface Props {
  toCopy: string
  children?: React.ReactNode
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    cursor: 'pointer',
    height: 17,
    '& svg': {
      width: 14
    }
  },
  icon: {
    opacity: 0.6,
    fontSize: 16
  }
})

export default function Copy(props: Props) {
  const classes = useStyles(props)
  const [isCopied, setCopied] = useCopyClipboard()
  const { toCopy, children } = props

  return (
    <Box className={classes.root} onClick={() => setCopied(toCopy)}>
      {isCopied ? <CheckIcon className={classes.icon} /> : <CopyIcon />}
      {children}
    </Box>
  )
}
