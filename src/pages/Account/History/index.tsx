import HistoryDualInvest from './HistoryDualInvest'
import HistoryChainType from './HistoryChainType'
import InvestTabs from 'components/Tabs/InvestTabs'

export default function History() {
  return <InvestTabs dualInvestContent={<HistoryDualInvest />} chainTypeContent={<HistoryChainType />} />
}
