import { useCallback, useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useParams, useHistory } from 'react-router-dom'
import Tabs from 'components/Tabs/Tabs'
import Image from 'components/Image'
import Dashboard from './Dashboard'
import Position from './Position/index'
import History from './History/index'
import Referral from './Referral'
import dashboardUrl from 'assets/images/dashboard.png'
import positionUrl from 'assets/images/position.png'
import historyUrl from 'assets/images/history.png'
import referralUrl from 'assets/images/referral.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { routes } from 'constants/routes'

export enum AccountTabs {
  dashboard = 0,
  position = 1,
  referral = 2,
  history = 3
}

export const AccountTabsRoute = {
  [AccountTabs.dashboard]: 'dashboard',
  [AccountTabs.position]: 'position',
  [AccountTabs.referral]: 'referral',
  [AccountTabs.history]: 'history'
}

export default function Account() {
  const history = useHistory()
  const { tab } = useParams<{ tab: string }>()
  const [currentTab, setCurrentTab] = useState(AccountTabs.dashboard)

  const handleTabClick = useCallback(
    tabNum => {
      setCurrentTab(tabNum)
      history.replace(routes.accountTab.replace(':tab', AccountTabsRoute[tabNum as keyof typeof AccountTabsRoute]))
    },
    [history]
  )

  useEffect(() => {
    if (tab) {
      setCurrentTab(AccountTabs[tab as keyof typeof AccountTabs])
    }
  }, [tab])

  return (
    <Box
      sx={{
        maxWidth: theme => theme.width.maxContent,
        margin: { xs: '0 0 auto', md: '62px 0 auto' },
        width: '100%',
        padding: { xs: 20, md: 0 }
      }}
    >
      <Tabs
        customCurrentTab={currentTab}
        customOnChange={handleTabClick}
        titles={[
          <Tab text="Dashboard" iconUrl={dashboardUrl} key="dashboard" />,
          <Tab text="Position" iconUrl={positionUrl} key="position" />,
          <Tab text="Referral" iconUrl={referralUrl} key="referral" />,
          <Tab text="History" iconUrl={historyUrl} key="history" />
        ]}
        contents={[
          <Dashboard key="dashboard" />,
          <Position key="position" />,
          <Referral key="referral" />,
          <History key="history" />
        ]}
        tabPadding="18px 0"
      />
    </Box>
  )
}

function Tab({ text, iconUrl }: { text: string; iconUrl: string }) {
  const isDownMd = useBreakpoint('md')
  return (
    <Typography key={text} fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 8.45, md: 12 } }}>
      {isDownMd ? (
        <Image src={iconUrl} style={{ width: 17, height: 'auto' }} />
      ) : (
        <Image src={iconUrl} style={{ width: 24, height: 'auto' }} />
      )}

      {text}
    </Typography>
  )
}
