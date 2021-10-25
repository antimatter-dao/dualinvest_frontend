import { Box } from '@material-ui/core'
import Button from 'components/Button/Button'
import { Chain } from 'models/chain'
import React from 'react'
import Modal from '../index'
import DestinationAddress from './DestinationAddress'
import SwapChain from './SwapChain'

export default function TransacitonPendingModal({
  children,
  toChain,
  fromChain,
  destinationAddress
}: {
  children: React.ReactNode
  toChain: Chain | null
  fromChain: Chain | null
  destinationAddress: string | undefined | null
}) {
  return (
    <Modal closeIcon>
      <Box display="grid" padding="40px" gridGap="28px" justifyItems="center" width="100%">
        {children}
        <Box justifySelf="start" width="100%">
          {fromChain && toChain && <SwapChain to={toChain} from={fromChain} />}
          <DestinationAddress address={destinationAddress ?? ''} />
          <Button>Confirm</Button>
        </Box>
      </Box>
    </Modal>
  )
}
