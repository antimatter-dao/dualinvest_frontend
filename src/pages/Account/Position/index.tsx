import PositionDualInvest from './PositionDualInvest'
//import PositionChainType from './PositionChainType'
import InvestTabs from 'components/Tabs/InvestTabs'
import PositionRecurVault from './PositionRecurVault'

export default function Position() {
  return <InvestTabs dualInvestContent={<PositionDualInvest />} recurVaultContent={<PositionRecurVault />} />
}
