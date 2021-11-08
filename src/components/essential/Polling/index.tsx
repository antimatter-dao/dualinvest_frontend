import { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { keyframes } from '@mui/system'
import { ExternalLink } from 'theme/components'
import { useBlockNumber } from 'state/application/hooks'
import { getEtherscanLink } from 'utils'
import { useActiveWeb3React } from 'hooks'

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledPolling = styled('div')(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  right: 0,
  bottom: 0,
  padding: '0.5rem',
  paddingRight: '25px',
  transition: 'opacity 0.25s ease',
  color: theme.palette.success.main,
  '& :hover': {
    opacity: 1
  },
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const StyledPollingDot = styled('div')(({ theme }) => ({
  width: '8px',
  height: '8px',
  minHeight: '8px',
  minWidth: '8px',
  marginLeft: '0.5rem',
  marginTop: '3px',
  borderRadius: '50%',
  position: 'relative',
  backgroundColor: theme.palette.success.main
}))

const Spinner = styled('div')(({ theme }) => ({
  animation: `${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite`,
  transform: 'translateZ(0)',
  borderTop: '1px solid transparent',
  borderRight: '1px solid transparent',
  borderBottom: '1px solid transparent',
  borderLeft: `2px solid ${theme.palette.success.main}`,
  background: 'transparent',
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  position: 'relative',
  left: '-3px',
  top: '-3px'
}))

export default function Polling() {
  const { chainId } = useActiveWeb3React()

  const blockNumber = useBlockNumber()

  const [isMounted, setIsMounted] = useState(true)

  useEffect(
    () => {
      const timer1 = setTimeout(() => setIsMounted(true), 1000)

      // this will clear Timeout when component unmount like in willComponentUnmount
      return () => {
        setIsMounted(false)
        clearTimeout(timer1)
      }
    },
    [blockNumber] //useEffect will run only one time
    //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
  )

  return (
    <ExternalLink href={chainId && blockNumber ? getEtherscanLink(chainId, blockNumber.toString(), 'block') : ''}>
      <StyledPolling>
        <Typography variant="body2" sx={{ opacity: isMounted ? '0.2' : '0.6' }}>
          {blockNumber}
        </Typography>
        <StyledPollingDot>{!isMounted && <Spinner />}</StyledPollingDot>
      </StyledPolling>
    </ExternalLink>
  )
}
