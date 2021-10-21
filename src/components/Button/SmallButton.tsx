import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { ButtonBase, Theme } from '@material-ui/core'

interface Props {
  onClick?: () => void
  background?: string
  disabled?: boolean
  color?: string
  children?: React.ReactNode
  fontSize?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '5px 8px',
      minWidth: 56,
      height: 'max-content',
      fontSize: (props: Props) => props.fontSize || 14,
      backgroundColor: theme.palette.grey.A200,
      color: theme.palette.primary.contrastText,
      fontWeight: 500,
      borderRadius: 14,
      transition: '.3s',
      '&:hover': {
        color: theme.palette.primary.main
      }
    },
    disabled: {
      opacity: theme.palette.action.disabledOpacity,
      backgroundColor: theme.palette.primary.light,
      color: '#464647'
    }
  })
)

export default function SmallButton(props: Props) {
  const { onClick, disabled } = props
  const classes = useStyles(props)

  return (
    <ButtonBase classes={{ ...classes }} onClick={onClick} disabled={disabled}>
      {props.children}
    </ButtonBase>
  )
}
