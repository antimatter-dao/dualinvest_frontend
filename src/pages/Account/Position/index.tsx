import PositionDualInvest from './PositionDualInvest'
import PositionChainType from './PositionChainType'
import InvestTabs from 'components/Tabs/InvestTabs'

export default function Position() {
  return <InvestTabs dualInvestContent={<PositionDualInvest />} chainTypeContent={<PositionChainType />} />
}
