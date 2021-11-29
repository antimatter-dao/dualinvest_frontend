import { NavLink } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import { routes } from 'constants/routes'
import theme from 'theme'

export default function DualInvestMgmt() {
  return (
    <Box display="grid" width="100%" alignContent="flex-start" marginBottom="auto" gap={48}>
      <Box
        display="flex"
        alignItems="center"
        sx={{ width: '100%', background: theme.palette.background.paper, padding: '28px 165px' }}
      >
        <NavLink to={routes.dualInvest} style={{ textDecoration: 'none' }}>
          <ArrowLeft />
          <Typography component="span" color={theme.bgColor.bg1} fontSize={14} ml={16}>
            Back
          </Typography>
        </NavLink>
      </Box>
    </Box>
  )
}
