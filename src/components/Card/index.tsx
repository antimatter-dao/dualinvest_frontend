import { Paper, useTheme } from '@material-ui/core'

export function OutlinedCard({
  children,
  color,
  classname,
  padding,
  width
}: {
  children: JSX.Element
  color?: string
  classname?: string
  padding?: string | number
  width?: string | number
}) {
  const theme = useTheme()

  return (
    <Paper
      variant="outlined"
      style={{
        backgroundColor: 'transparent',
        border: `1px solid ${color ?? theme.palette.grey.A400}`,
        padding,
        width
      }}
      classes={{ root: classname }}
    >
      {children}
    </Paper>
  )
}
