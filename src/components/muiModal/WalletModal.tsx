import React, { useState } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Box, Typography } from '@material-ui/core'
import Modal from 'components/muiModal'
// import useBreakpoint from 'hooks/useBreakpoint'
import METAMASK_ICON_URL from 'assets/wallet/meta_mask.svg'
import WALLETCONNECT_ICON_URL from 'assets/wallet/wallet_connect.svg'
import OutlineButton from 'components/Button/OutlineButton'
import Image from '../Image'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconURL: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  // INJECTED: {
  //   connector: injected,
  //   name: 'Injected',
  //   iconURL: INJECTED_ICON_URL,
  //   description: 'Injected web3 provider.',
  //   href: null,
  //   color: '#010101',
  //   primary: true,
  // },
  METAMASK: {
    // connector: injected,
    name: 'MetaMask',
    iconURL: METAMASK_ICON_URL,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    // connector: walletconnect,
    name: 'WalletConnect',
    iconURL: WALLETCONNECT_ICON_URL,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  }
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconURL: COINBASE_ICON_URL,
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5',
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconURL: COINBASE_ICON_URL,
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true,
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconURL: FORTMATIC_ICON_URL,
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true,
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconURL: PORTIS_ICON_URL,
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true,
  // },
}

interface OptionProps {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: () => void
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}

const WALLET_VIEWS = {
  OPTIONS: 'options',
  ACCOUNT: 'account'
}

export default function WalletModal({ onDismiss }: { onDismiss: () => void }) {
  const [walletView] = useState(WALLET_VIEWS.OPTIONS)
  // const { matches } = useBreakpoint()

  const getOptions = () => {
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]

      return (
        <Option
          id={`connect-${key}`}
          onClick={onClickOption}
          key={key}
          color={option.color}
          link={option.href}
          header={option.name}
          subheader={null}
          icon={option.iconURL}
        />
      )
    })
  }

  const onClickOption = () => {
    onDismiss && onDismiss()
  }

  return (
    <Modal closeIcon={walletView === WALLET_VIEWS.OPTIONS}>
      <Box width={'100%'} padding="32px" display="flex" flexDirection="column" alignItems="center" gridGap={20}>
        <Typography variant="h6">Connect to a wallet</Typography>
        <Box display="grid" gridGap="12px">
          {getOptions()}
        </Box>
      </Box>
    </Modal>
  )
}

function Option(props: OptionProps) {
  const { onClick, header, icon } = props
  return (
    <OutlineButton width="320px" onClick={onClick}>
      <Image src={icon} alt={`wallet icon-${header}`} style={{ marginRight: 16 }} />
      {header}
    </OutlineButton>
  )
}
