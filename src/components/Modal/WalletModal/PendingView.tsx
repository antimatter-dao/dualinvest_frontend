import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'
import { Box, useTheme } from '@mui/material'
import Button from 'components/Button/Button'
import { ReactComponent as CrossCircle } from 'assets/componentsIcon/statusIcon/error_icon.svg'
import { OutlinedCard } from 'components/Card'
import Spinner from 'components/Spinner'

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
  children
}: {
  children: React.ReactNode
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector) => void
}) {
  const theme = useTheme()

  return (
    <Box display="grid" gap="32px" width="100%" justifyItems="center">
      {error ? (
        <Box display="grid" justifyItems="center" gap="16px" width="100%">
          <CrossCircle />
          <span>Error connecting. Please try again</span>
        </Box>
      ) : (
        <>
          <OutlinedCard color={theme.palette.primary.main} style={{ margin: '20px' }} padding="16px" width="80%">
            <Box display="flex" gap="16px" width="100%">
              <Spinner />
              Initializing...
            </Box>
          </OutlinedCard>
        </>
      )}

      {error && (
        <Box display="flex" gap="10px" width="100%">
          {children}
          {error && (
            <Button
              onClick={() => {
                setPendingError(false)
                connector && tryActivation(connector)
              }}
            >
              Try Again
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}
