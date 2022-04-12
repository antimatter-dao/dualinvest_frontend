import HistoryDualInvest from './HistoryDualInvest'
//import HistoryChainType from './HistoryChainType'
import InvestTabs from 'components/Tabs/InvestTabs'
// import HistoryRecurVault from './HistoryRecurVault'

export default function History() {
  return (
    <InvestTabs
      dualInvestContent={<HistoryDualInvest />}
      // recurVaultContent={<HistoryRecurVault />}
    />
  )
}
