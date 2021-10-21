import { Paper, useTheme } from '@material-ui/core'

export function OutlinedCard({
  children,
  color,
  classname
}: {
  children: JSX.Element
  color?: string
  classname?: string
}) {
  const theme = useTheme()

  return (
    <Paper
      variant="outlined"
      style={{ backgroundColor: 'transparent', border: `1px solid ${color ?? theme.palette.grey.A400}` }}
      classes={{ root: classname }}
    >
      {children}
    </Paper>
  )
}
