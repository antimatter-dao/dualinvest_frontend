import { useEffect } from 'react'
import { X } from 'react-feather'
import Button from 'components/Button/Button'
import { AutoColumn } from 'components/Column'
import Modal from './index'
import { RowBetween } from 'components/Row'
import { Typography } from '@material-ui/core'
import useModal from 'hooks/useModal'

export default function WarningModal() {
  const { showModal, hideModal } = useModal()

  useEffect(() => {
    showModal(<WarningModalContent onDismiss={hideModal} />)
  }, [hideModal, showModal])

  return <></>
}

function WarningModalContent({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Modal maxWidth="608px" width="100%">
      <AutoColumn
        gap="24px"
        style={{
          width: '100%',
          padding: 32
        }}
      >
        <RowBetween>
          <div />
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            Warning!
          </Typography>
          <X onClick={onDismiss} style={{ cursor: 'pointer' }} />
        </RowBetween>

        <Typography variant="inherit">
          Please note.The dapp is only open to non-U.S. persons and entities. All registrants must meet eligibility
          requirements to participate.
          <br />
          <br />
          The dapp is not and will not be offered or sold, directly or indirectly, to any person who is a resident,
          organized, or located in any country or territory subject to OFAC comprehensive sanctions programs from time
          to time, including Cuba, Crimea region of Ukrain, Democratic people’s Republic of Korea, Iran, Syria, any
          person found on the OFAC specially designated nationals, blocked persons list, any other consolidated
          prohibited persons list as determined by any applicable governmental authority.
        </Typography>
        <Typography variant="inherit">The project is in beta, use at your own risk.</Typography>
        <Button onClick={onDismiss}>Understand</Button>
      </AutoColumn>
    </Modal>
  )
}
