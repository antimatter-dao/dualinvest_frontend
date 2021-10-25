import { Box, useTheme, styled } from '@material-ui/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Text } from 'rebass'
import Image from 'components/Image'
import CoinbaseWalletIcon from 'assets/walletIcon/coinbaseWalletIcon.svg'
import FortmaticIcon from 'assets/walletIcon/fortmaticIcon.png'
import PortisIcon from 'assets/walletIcon/portisIcon.png'
import WalletConnectIcon from 'assets/walletIcon/walletConnectIcon.svg'
import Matamask from 'assets/walletIcon/metamask.png'
import { fortmatic, injected, portis, walletconnect, walletlink } from 'connectors'
import { useActiveWeb3React } from 'hooks'

const Dot = styled('span')({
  width: 16,
  height: 16,
  background: 'linear-gradient(135deg, #ffffff 4.17%, rgba(255, 255, 255, 0) 75%)',
  border: '0.6px solid #ffffff',
  borderRadius: '50%'
})

function StatusIcon(connector: AbstractConnector | undefined) {
  const style = { height: 16, width: 16, objectFit: 'contain' as const, margin: '0 15px' }
  if (connector === injected) {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    return isMetaMask ? <Image style={style} src={Matamask} /> : <Dot />
  } else if (connector === walletconnect) {
    return <Image style={style} src={WalletConnectIcon} />
  } else if (connector === walletlink) {
    return <Image style={style} src={CoinbaseWalletIcon} />
  } else if (connector === fortmatic) {
    return <Image style={style} src={FortmaticIcon} />
  } else if (connector === portis) {
    return <Image style={style} src={PortisIcon} />
  }
  return null
}

export default function DestinationAddress({ address, margin }: { address: string; margin?: string }) {
  const { connector } = useActiveWeb3React()
  const theme = useTheme()

  return (
    <>
      {address && (
        <Box display="flex" margin={margin || '12px 0 0'} fontSize="14px">
          <Text marginRight="10px" color={theme.textColor.text4}>
            Destination:
          </Text>
          <Box display="flex" alignItems={'center'}>
            {StatusIcon(connector)}
            <Text marginLeft="8px" color={theme.textColor.text3}>
              {address}
            </Text>
          </Box>
        </Box>
      )}
    </>
  )
}
