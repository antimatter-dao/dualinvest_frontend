import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { ButtonBase, Theme } from '@material-ui/core'

interface Props {
  onClick?: () => void
  width?: string
  height?: string
  backgroundColor?: string
  disabled?: boolean
  color?: string
  children?: React.ReactNode
  fontSize?: string
  classname?: string
  style?: React.CSSProperties
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: (props: Props) => props.width || '100%',
      height: (props: Props) => props.height || 60,
      fontSize: (props: Props) => props.fontSize || 16,
      backgroundColor: (props: Props) => props.backgroundColor || theme.palette.primary.main,
      color: (props: Props) => props.color || theme.palette.primary.contrastText,
      fontWeight: 500,
      borderRadius: theme.shape.borderRadius,
      transition: '.3s',
      '&:hover': {
        background: theme.palette.primary.dark
      }
    },
    disabled: {
      opacity: 0.24,
      backgroundColor: theme.palette.primary.dark,
      color: '#464647'
    }
  })
)

export default function Button(props: Props) {
  const { onClick, disabled, classname, style } = props
  const classes = useStyles(props)

  return (
    <ButtonBase classes={{ ...classes }} onClick={onClick} disabled={disabled} className={classname} style={style}>
      {props.children}
    </ButtonBase>
  )
}
