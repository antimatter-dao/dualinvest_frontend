import { Box, useTheme } from '@mui/material'
import { HideOnMobile } from 'theme/index'
import { ReactComponent as Medium } from 'assets/socialLinksIcon/medium.svg'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'
import { ReactComponent as Telegram } from 'assets/socialLinksIcon/telegram.svg'
import { ExternalLink } from 'theme/components'
import TextButton from 'components/Button/TextButton'

export default function Footer() {
  const theme = useTheme()

  return (
    <HideOnMobile>
      <footer
        style={{
          height: theme.height.footer,
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          padding="9px 85px 28px 60px"
          gap="40px"
          sx={{
            '& svg': {
              fill: theme => theme.palette.text.primary
            }
          }}
        >
          <TextButton>
            <ExternalLink href="">
              <Medium />
            </ExternalLink>
          </TextButton>
          <TextButton>
            <ExternalLink href="">
              <Twitter />
            </ExternalLink>
          </TextButton>
          <TextButton>
            <ExternalLink href="">
              <Telegram />
            </ExternalLink>
          </TextButton>
        </Box>
      </footer>
    </HideOnMobile>
  )
}
