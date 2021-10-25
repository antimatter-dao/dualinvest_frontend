import { Box, makeStyles } from '@material-ui/core'
import { HideOnMobile } from 'theme/muiTheme'
import { ReactComponent as Medium } from 'assets/socialLinksIcon/medium.svg'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'
import { ReactComponent as Telegram } from 'assets/socialLinksIcon/telegram.svg'
import { ExternalLink } from 'theme'
import TextButton from 'components/Button/TextButton'

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.height.footer
  }
}))

export default function Footer() {
  const classes = useStyles()

  return (
    <HideOnMobile>
      <footer className={classes.root}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
          padding="9px 60px 28px"
          gridGap="40px"
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
