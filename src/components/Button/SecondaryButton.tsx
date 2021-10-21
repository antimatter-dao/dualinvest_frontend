import React from 'react'
import { ButtonBase, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

interface Props {
  onClick?: () => void
  primary?: boolean
  children: React.ReactNode
  width?: string | number
  height?: string | number
  fontSize?: string
  disabled?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: (props: Props) => props.width || '100%',
      fontSize: (props: Props) => props.fontSize || 16,
      height: (props: Props) => props.height || 60,
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.secondary.main}`,
      backgroundColor: theme.palette.secondary.main,
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        borderColor: theme.palette.secondary.dark
      }
    },
    disabled: {
      opacity: theme.palette.action.disabledOpacity,
      backgroundColor: theme.palette.secondary.light,
      borderColor: theme.palette.secondary.light
    }
  })
)

export default function SecondaryButton(props: Props) {
  const { onClick, disabled } = props
  const classes = useStyles(props)

  return (
    <ButtonBase className={classes.root} onClick={onClick} disabled={disabled}>
      {props.children}
    </ButtonBase>
  )
}
