import { Box } from '@mui/material'
import Spinner from 'components/Spinner'
import Tabs from 'components/Tabs/Tabs'
import { Suspense } from 'react'
import Dashboard from './Dashboard'
import Position from './Position'
import History from './History'

export default function Account() {
  return (
    <Box sx={{ maxWidth: theme => theme.width.maxContent, margin: '62px 24px auto', width: '100%' }}>
      <Tabs
        titles={['Dashboard', 'Position', 'History']}
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
