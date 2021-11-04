import React from 'react'
import { Theme, ButtonBase } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Props {
  onClick?: () => void
  width?: string
  height?: string
  children?: React.ReactNode
  primary?: boolean
  disabled?: boolean
  style?: React.CSSProperties
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
      [theme.breakpoints.down('md')]: {
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
  const { onClick, disabled, style } = props
  const classes = useStyles(props)

  return (
    <ButtonBase
      classes={{ root: classes.root, disabled: classes.disabled }}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {props.children}
      <ExpandMoreIcon />
    </ButtonBase>
  )
}
