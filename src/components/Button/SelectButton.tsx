import React from 'react'
import { Theme, ButtonBase } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

interface Props {
  onClick?: () => void
  width?: string
  height?: string
  children?: React.ReactNode
  primary?: boolean
  disabled?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: (props: Props) => props.width || 160,
      height: (props: Props) => props.height || 46,
      backgroundColor: (props: Props) => (props.primary ? theme.palette.primary.main : theme.palette.text.secondary),
      color: theme.palette.text.primary,
      borderRadius: 10,
      fontSize: 16,
      fontWeight: 400,
      transition: '.3s',
      padding: '0 15.67px 0 20px',
      border: '1px solid transparent',
      '&:hover': {
        background: theme.palette.primary.main,
        border: '1px solid ' + theme.palette.primary.main
      },
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        position: 'unset',
        right: 'unset',
        top: 'unset',
        width: '100%!important'
      }
    },
    disabled: {
      // opacity: theme.palette.action.disabledOpacity,
      backgroundColor: theme.palette.text.secondary,
      color: 'rgba(255,255,255,0.24)'
    }
  })
)

export default function SelectButton(props: Props) {
  const { onClick, disabled } = props
  const classes = useStyles(props)

  return (
    <ButtonBase classes={{ root: classes.root, disabled: classes.disabled }} onClick={onClick} disabled={disabled}>
      {props.children}
      <ExpandMoreIcon />
    </ButtonBase>
  )
}
