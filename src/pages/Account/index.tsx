import { Suspense } from 'react'
import { Box, Typography } from '@mui/material'
import Spinner from 'components/Spinner'
import Tabs from 'components/Tabs/Tabs'
import Image from 'components/Image'
import Dashboard from './Dashboard'
import Position from './Position'
import History from './History'
import dashboardUrl from 'assets/images/dashboard.png'
import positionUrl from 'assets/images/position.png'
import historyUrl from 'assets/images/history.png'

export default function Account() {
  return (
    <Box
      sx={{
        maxWidth: theme => theme.width.maxContent,
        margin: { xs: '0 0 auto', md: '62px 24px auto' },
        width: '100%',
        padding: { xs: 20, md: 0 }
      }}
    >
      <Tabs
        titles={[
          <Tab text="Dashboard" iconUrl={dashboardUrl} key="dashboard" />,
          <Tab text="Position" iconUrl={positionUrl} key="position" />,
          <Tab text="History" iconUrl={historyUrl} key="history" />
        ]}
        contents={[
          <Suspense fallback={<Spinner size={100} />} key="dashboard">
            <Dashboard />
          </Suspense>,
          <Suspense fallback={<Spinner size={100} />} key="position">
            <Position />
          </Suspense>,
          <Suspense fallback={<Spinner size={100} />} key="history">
            <History />
          </Suspense>
        ]}
      />
    </Box>
  )
}

function Tab({ text, iconUrl }: { text: string; iconUrl: string }) {
  return (
    <Typography key="dashboard" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Image src={iconUrl} style={{ width: 24, height: 'auto' }} />
      {text}
    </Typography>
  )
}
