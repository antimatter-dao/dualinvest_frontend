import { useMediaQuery, useTheme } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

export default function useBreakpoint(breakpoint: Breakpoint = 'sm') {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down(breakpoint))

  return { matches }
}
