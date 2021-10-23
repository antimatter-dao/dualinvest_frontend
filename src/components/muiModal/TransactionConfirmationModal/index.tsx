import React from 'react'
import { useTheme, Box } from '@material-ui/core'
import styled from 'styled-components'
import Modal from 'components/muiModal'
import { Text } from 'rebass'
import { CloseIcon } from '../../../theme'
import OutlineButton from 'components/Button/OutlineButton'
import { AutoColumn } from '../../Column'
import { useActiveWeb3React } from '../../../hooks'
import { LoadingView, SubmittedView } from 'components/muiModal/TransactionConfirmationModal/ModalViews'
import { ReactComponent as CrossCircle } from 'assets/componentsIcon/cross_circle.svg'
import { Currency } from '../../../constants/token'
import { ChainId } from '../../../constants/chain'

const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
  border-radius: 42px;
  background: ${({ theme }) => theme.gradient1};
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 0 3rem 2rem;
`

const Close = styled(CloseIcon)`
  color: ${({ theme }) => theme.text2};
`
function ConfirmationPendingContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: string }) {
  const theme = useTheme()
  return (
    <>
      <LoadingView onDismiss={onDismiss}>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={400} fontSize={18}>
            Waiting For Confirmation
          </Text>
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontWeight={400} fontSize={14} textAlign="center" color={theme.textColor.text2}>
              {pendingText}
            </Text>
          </AutoColumn>
        </AutoColumn>
      </LoadingView>
    </>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
}) {
  return (
    <>
      <SubmittedView onDismiss={onDismiss} hash={hash}>
        <Text fontWeight={400} fontSize={18}>
          Transaction Submitted
        </Text>
      </SubmittedView>
    </>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent
}: {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <Section>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <div></div>
          <Text fontWeight={500} fontSize={18}>
            {title}
          </Text>
          <Close onClick={onDismiss} />
        </Box>
        {topContent()}
      </Section>
      <BottomSection gap="8px">{bottomContent()}</BottomSection>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const theme = useTheme()
  return (
    <Wrapper>
      <Section>
        <Box display="flex">
          <Close onClick={onDismiss} />
        </Box>
        <AutoColumn style={{ padding: '2rem 0' }} gap="24px" justify="center">
          <CrossCircle />
          <Text
            fontWeight={500}
            fontSize={16}
            color={theme.textColor.text1}
            style={{ textAlign: 'center', width: '85%' }}
          >
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <OutlineButton onClick={onDismiss} primary>
          Dismiss
        </OutlineButton>
      </BottomSection>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
  submittedContent?: () => React.ReactNode
}

export default function TransactionConfirmationModal({
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
  submittedContent
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <>
          (
          {submittedContent ? (
            submittedContent()
          ) : (
            <TransactionSubmittedContent
              chainId={chainId}
              hash={hash}
              onDismiss={onDismiss}
              currencyToAdd={currencyToAdd}
            />
          )}
          ){' '}
        </>
      ) : (
        content()
      )}
    </Modal>
  )
}
