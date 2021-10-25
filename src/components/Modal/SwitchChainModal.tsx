import { Typography, Box } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Button from 'components/Button/Button'
import { OutlinedCard } from 'components/Card'
import { Chain } from 'models/chain'
import Modal from '.'

export default function SwitchChain({
  fromChain,
  toChain,
  onConfirm
}: {
  fromChain: Chain | null
  toChain: Chain | null
  onConfirm: () => void
}) {
  return (
    <Modal>
      <Box padding="40px" display="grid" gridGap="32px" justifyItems="center" width="100%">
        <Typography variant="h6">Switch Chain</Typography>
        {fromChain && toChain && (
          <Box display="flex" justifyContent="space-between">
            <OutlinedCard width="100%">
              <Typography variant="inherit">{fromChain.name}</Typography>
            </OutlinedCard>
            <ArrowForwardIcon style={{ margin: '0 20px', flexGrow: 0 }} />
            <OutlinedCard width="100%">
              <Typography variant="inherit">{toChain.name}</Typography>
            </OutlinedCard>
          </Box>
        )}
        <Button onClick={onConfirm}>Confirm</Button>
      </Box>
    </Modal>
  )
}
