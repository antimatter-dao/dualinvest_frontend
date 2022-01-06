import { useState } from 'react'
import PositionDualInvest from './PositionDualInvest'
import { Box, styled } from '@mui/material'
import PositionChainType from './PositionChainType'
//import Tabs from 'components/Tabs/Tabs'
import SmallButton from 'components/Button/SmallButton'

enum PositionTabs {
  dualInvest = 'Dual Investment',
  chainType = 'Chain-Type Option'
}

const TabButton = styled(SmallButton)<{ active?: boolean }>`
  border: 1px solid #b2f355;
  opacity: ${({ active }) => (active ? '1' : '0.5')};
  width: 264px;
  height: 48px;
`

export default function Position() {
  const [currentTab, setCurrentTab] = useState(PositionTabs.dualInvest)

  return (
    <Box
      sx={{
        maxWidth: theme => theme.width.maxContent,
        margin: { xs: '0 0 auto', md: '62px 0 auto' },
        width: '100%',
        padding: { xs: 20, md: 0 }
      }}
    >
      <TabButton
        onClick={() => {
          setCurrentTab(PositionTabs.dualInvest)
        }}
        active={currentTab === PositionTabs.dualInvest}
      >
        {PositionTabs.dualInvest}
      </TabButton>

      <TabButton
        onClick={() => {
          setCurrentTab(PositionTabs.chainType)
        }}
        active={currentTab === PositionTabs.chainType}
      >
        {PositionTabs.chainType}
      </TabButton>

      {currentTab === PositionTabs.dualInvest && <PositionDualInvest />}
      {currentTab === PositionTabs.chainType && <PositionChainType />}
    </Box>
  )
}

/* function Tab({ text }: { text: string }) {
  return (
    <Typography
      key="position"
      fontWeight={500}
      sx={{ display: 'flex', alignItems: 'center', gap: { xs: 8.45, md: 12 } }}
    >
      {text}
    </Typography>
  )
} */
