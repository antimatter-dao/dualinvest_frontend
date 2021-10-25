import { Divider as MuiDivider, makeStyles, Theme } from '@material-ui/core'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  //extension must be in px
  extension?: number
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: 'none',
    height: (props: Props) => (props.orientation === 'vertical' ? '100%' : '1px'),
    backgroundColor: (props: Props) => (props.orientation === 'vertical' ? theme.textColor.text1 : theme.bgColor.bg4),
    margin: (props: Props) => (props.extension ? `0 -${props.extension}px` : '0')
  }
}))

export default function Divider(props: Props) {
  const classes = useStyles(props)

  return (
    <MuiDivider
      className={classes.root}
      {...props}
      style={{
        width: props.extension ? `calc(100% + ${props.extension * 2}px` : props.orientation === 'vertical' ? 1 : '100%'
      }}
    />
  )
}
