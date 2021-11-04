import React from 'react'
import { makeStyles, createStyles } from '@mui/styles'
import { ButtonBase, Theme } from '@mui/material'
interface Props {
  onClick?: (e?: any) => void
  children: React.ReactNode
  fontSize?: number | string
  fontWeight?: number
  primary?: boolean
  underline?: boolean
  opacity?: number
  style?: React.CSSProperties
  disabled?: boolean
  classname?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textDecoration: (props: Props) => (props.underline ? 'underline' : 'none'),
      color: (props: Props) => (props.primary ? theme.palette.primary.main : theme.palette.primary.contrastText),
      fontSize: (props: Props) => props.fontSize || 16,
      fontWeight: (props: Props) => props.fontWeight || 500,
      opacity: (props: Props) => props.opacity || 1,
      '&:hover': {
        opacity: 1,
        color: (props: Props) => (props.primary ? theme.palette.primary.dark : theme.palette.primary.main)
      }
    }
  })
)

export default function TextButton(props: Props) {
  const { onClick, style, disabled, classname } = props
  const classes = useStyles(props)
  return (
    <ButtonBase classes={{ ...classes }} onClick={onClick} style={style} disabled={disabled} className={classname}>
      {props.children}
    </ButtonBase>
  )
}
