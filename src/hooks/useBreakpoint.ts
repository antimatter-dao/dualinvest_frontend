import { useMediaQuery, useTheme } from '@mui/material'
import { Breakpoint } from '@mui/material/styles'

export default function useBreakpoint(breakpoint: Breakpoint = 'sm') {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down(breakpoint))

  return matches
}
