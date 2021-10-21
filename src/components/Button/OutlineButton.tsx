import React from 'react'
import { ButtonBase, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'
interface Props {
  onClick?: (() => void) | null
  primary?: boolean
  children: React.ReactNode
  width?: string | number
  height?: string | number
  fontSize?: string
  disabled?: boolean
  color?: string
  borderRadius?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: (props: Props) => props.width || '100%',
      border: (props: Props) =>
        `solid 1px ${
          props.color ? props.color : props.primary ? theme.palette.primary.main : theme.palette.text.secondary
        }`,
      fontSize: (props: Props) => props.fontSize || 16,
      foneWeight: (props: Props) => (props.primary ? 500 : 400),
      height: (props: Props) => props.height || 60,
      color: (props: Props) => (props.primary ? theme.palette.primary.main : theme.palette.primary.contrastText),
      borderRadius: (props: Props) => props.borderRadius ?? theme.shape.borderRadius,
      '&:hover': {
        color: theme.palette.primary.contrastText,
        borderColor: (props: Props) => (props.primary ? theme.palette.primary.dark : theme.palette.primary.main)
      }
    },
    disabled: {
      opacity: theme.palette.action.disabledOpacity
    }
  })
)

export default function OutlineButton(props: Props) {
  const { onClick, disabled } = props
  const classes = useStyles(props)

  return (
    <ButtonBase className={classes.root} onClick={onClick ?? undefined} disabled={disabled}>
      {props.children}
    </ButtonBase>
  )
}
