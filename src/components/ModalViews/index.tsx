import { useActiveWeb3React } from '../../hooks'
import { AutoColumn, ColumnCenter } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { CloseIcon } from '../../theme'
import { ReactComponent as CheckCircle } from '../../assets/svg/transaction_submitted.svg'
import { ReactComponent as CrossCircle } from '../../assets/svg/transaction_error.svg'
import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme/components'
import useTheme from 'hooks/useTheme'
import { ButtonPrimary } from 'components/Button'
import { Typography } from '@material-ui/core'
import { Text } from 'rebass'
import Spinner from 'components/Spinner'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 0 0 28px;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <Spinner size={'45px'} color="#ffffff" />
      </ConfirmedIcon>
      <AutoColumn gap="28px" justify={'center'}>
        {children}
        <Typography variant="caption">Confirm this transaction in your wallet</Typography>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({
  children,
  onDismiss,
  hash,
  hideLink,
  isError
}: {
  children: any
  onDismiss: () => void
  hash: string | undefined
  hideLink?: boolean
  isError?: boolean
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        {isError ? <CrossCircle /> : <CheckCircle style={{ width: '32px', height: '32px' }} />}
      </ConfirmedIcon>
      <AutoColumn gap="32px" justify={'center'}>
        {children}
        {!hideLink && !isError && chainId && hash && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ color: theme.primary1 }}>
            <Text fontWeight={400} fontSize={14} color={theme.primary1}>
              View on Etherscan
            </Text>
          </ExternalLink>
        )}
        <ButtonPrimary onClick={onDismiss} style={{ marginTop: '-10px' }}>
          <Text fontWeight={500} fontSize={16} color={theme.bg1}>
            Close
          </Text>
        </ButtonPrimary>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
