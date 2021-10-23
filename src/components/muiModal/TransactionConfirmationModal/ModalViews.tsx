import { Typography, useTheme, Box } from '@material-ui/core'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../../hooks'
import { AutoColumn } from '../../Column'
import { CloseIcon } from '../../../theme'
import { ReactComponent as CheckCircle } from 'assets/componentsIcon/check_circle.svg'
import { ReactComponent as CrossCircle } from 'assets/componentsIcon/cross_circle.svg'
import { getEtherscanLink } from '../../../utils'
import { ExternalLink } from '../../../theme/components'
import { ButtonPrimary } from 'components/Button'
import Spinner from 'components/Spinner'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled.div`
  padding: 0 0 28px;
  display: grid;
  align-items: center;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <div />
        <CloseIcon onClick={onDismiss} />
      </Box>
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
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <div />
        <CloseIcon onClick={onDismiss} />
      </Box>
      <ConfirmedIcon>
        {isError ? <CrossCircle /> : <CheckCircle style={{ width: '32px', height: '32px' }} />}
      </ConfirmedIcon>
      <AutoColumn gap="32px" justify={'center'}>
        {children}
        {!hideLink && !isError && chainId && hash && (
          <ExternalLink
            href={getEtherscanLink(chainId, hash, 'transaction')}
            style={{ color: theme.palette.primary.main }}
          >
            <Text fontWeight={400} fontSize={14} color={theme.palette.primary.main}>
              View on Etherscan
            </Text>
          </ExternalLink>
        )}
        <ButtonPrimary onClick={onDismiss} style={{ marginTop: '-10px' }}>
          <Text fontWeight={500} fontSize={16} color={theme.bgColor.bg1}>
            Close
          </Text>
        </ButtonPrimary>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
