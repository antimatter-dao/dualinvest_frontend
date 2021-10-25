import { useState, useCallback } from 'react'
import { X, ChevronUp, Menu } from 'react-feather'
import { NavLink } from 'react-router-dom'
import { Box, makeStyles, MenuItem, AppBar } from '@material-ui/core'
import Modal from 'components/Modal'
import ChainSwap from '../../assets/svg/chain_swap.svg'
import { ExternalLink } from '../../theme'
import { ShowOnMobile } from 'theme/muiTheme'
import Image from 'components/Image'
import TextButton from 'components/Button/TextButton'
import { Tabs } from './'

const useMobileStyle = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: theme.height.mobileHeader,
    backgroundColor: theme.palette.background.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 'none',
    padding: '28px 24px'
  },
  mainLogo: {
    '& img': {
      width: 136,
      height: 34.7
    },
    '&:hover': {
      cursor: 'pointer'
    }
  },
  navLink: {
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 24,
    color: theme.textColor.text1,
    padding: '13px 24px',
    width: '100%',
    textAlign: 'left',
    '&.active': {
      color: theme.palette.primary.main
    },
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

export default function MobileHeader() {
  const classes = useMobileStyle()
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleDismiss = useCallback(() => {
    setIsOpen(false)
  }, [])

  const MobileMenu = useCallback(
    ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => (
      <Modal isCardOnMobile customOnDismiss={onDismiss} customIsOpen={isOpen} maxWidth="100%">
        <Box display="grid" gridGap="15px">
          {Tabs.map(({ title, route, link, titleContent, subTab }) => {
            const content = titleContent ?? title
            return subTab ? (
              <Accordion placeholder="About">
                {subTab.map(sub => {
                  const subContent = sub.titleContent ?? sub.title
                  return sub.link ? (
                    <MenuItem key={sub.link}>
                      <ExternalLink href={sub.link} className={classes.navLink}>
                        {subContent}
                      </ExternalLink>
                    </MenuItem>
                  ) : (
                    <MenuItem key={sub.title} onClick={onDismiss} className={classes.navLink}>
                      {subContent}
                    </MenuItem>
                  )
                })}
              </Accordion>
            ) : link ? (
              <ExternalLink href={link} className={classes.navLink} key={link}>
                {content}
              </ExternalLink>
            ) : (
              route && (
                <NavLink
                  key={title}
                  id={`${route}-nav-link`}
                  to={route}
                  className={classes.navLink}
                  onClick={onDismiss}
                >
                  {content}
                </NavLink>
              )
            )
          })}
        </Box>
      </Modal>
    ),
    [classes.navLink]
  )

  return (
    <>
      <MobileMenu isOpen={isOpen} onDismiss={handleDismiss} />
      <ShowOnMobile>
        <AppBar className={classes.root}>
          <Box display="flex" alignItems="center">
            <NavLink id={'chainswap'} to={'/'} className={classes.mainLogo}>
              <Image src={ChainSwap} alt={'chainswap'} />
            </NavLink>
          </Box>
          {isOpen ? (
            <TextButton onClick={handleDismiss}>{<X />}</TextButton>
          ) : (
            <TextButton onClick={handleClick}>{<Menu />}</TextButton>
          )}
        </AppBar>
      </ShowOnMobile>
    </>
  )
}

function Accordion({ children, placeholder }: { children: React.ReactNode; placeholder: string }) {
  const classes = useMobileStyle()
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = useCallback(() => {
    setIsOpen(state => !state)
  }, [])
  return (
    <>
      <Box className={classes.navLink} display="flex" alignItems="center" gridGap={12} onClick={handleClick}>
        {placeholder} <ChevronUp style={isOpen ? {} : { transform: 'rotate(180deg)' }} />
      </Box>
      <Box padding="0 15px"> {isOpen && children}</Box>
    </>
  )
}
