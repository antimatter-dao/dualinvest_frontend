import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'
import { Box, useTheme } from '@material-ui/core'
import Button from 'components/Button/Button'
import { ReactComponent as CrossCircle } from 'assets/componentsIcon/cross_circle.svg'
import { AutoColumn } from 'components/Column'
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
    <Box display="grid" gridGap="32px" width="100%" justifyContent="center">
      {error ? (
        <AutoColumn justify="center" gap="16px">
          <CrossCircle />
          Error connecting. Please try again
        </AutoColumn>
      ) : (
        <>
          <OutlinedCard color={theme.palette.primary.main} padding="16px" width="230px">
            <Box display="flex" gridGap="16px" width="100%">
              <Spinner />
              Initializing...
            </Box>
          </OutlinedCard>
        </>
      )}

      {error && (
        <Box display="flex" gridGap="10px" width="100%">
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
