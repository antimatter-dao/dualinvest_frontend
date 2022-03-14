import { Box } from '@mui/material'
import { ChainId, ChainsBgImgsFilled } from 'constants/chain'

export function DefiTemplateImage({ chainId }: { chainId: ChainId }) {
  return (
    <Box
      position={{ xs: 'static', md: 'absolute' }}
      bottom={0}
      right={{ xs: '0', md: '-40px' }}
      zIndex={1}
      mb={{ xs: -30, md: 0 }}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <Box
        position="relative"
        sx={{
          maxWidth: '100%',
          '& svg': {
            maxWidth: '100%'
          }
        }}
      >
        {ChainsBgImgsFilled[chainId] ?? null}
      </Box>
    </Box>
  )
}
