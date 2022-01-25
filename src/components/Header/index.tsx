import React, { useState, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AppBar, Box, IconButton, MenuItem, styled as muiStyled, styled, Button as MuiButton } from '@mui/material'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile, ShowOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
import antimatter from '../../assets/svg/antimatter.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import NetworkSelect from './NetworkSelect'
import referralUrl from 'assets/images/referral.png'
import { useReferalModal } from 'hooks/useReferralModal'
import { useActiveWeb3React } from 'hooks'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const Tabs: Tab[] = [
  {
    title: 'Invest',
    subTab: [
      { title: 'Dual Investment', route: routes.dualInvest },
      { title: 'Chain-type Option', route: routes.chainOption },
      { title: 'Recurring Vault', route: routes.recurringVault }
    ]
  },
  // { title: 'Dual Investment', route: routes.dualInvest },
  { title: 'Account', route: routes.accountTab.replace(':tab', 'dashboard') },
  { title: 'DAO', link: 'https://dao.antimatter.finance/#/' },
  { title: 'Docs', link: 'https://docs.antimatter.finance/' },
  {
    title: 'Referral',
    titleContent: (
      <>
        Referral
        <Image src={referralUrl} style={{ height: 14, width: 14, marginLeft: 3 }} />
      </>
    ),
    route: '/referal'
  },
  {
    title: 'Labs',
    subTab: [
      { title: 'BULL & BEAR Option', link: 'https://app.antimatter.finance/#/option_trading' },
      { title: 'Nonfungible Finance', link: 'https://nonfungible.finance/#/' }
    ]
  }
]

const navLinkSX = ({ theme }: any) => ({
  textDecoration: 'none',
  fontSize: 14,
  color: theme.palette.text.primary,
  opacity: 0.5,
  '&:hover': {
    opacity: 1
  }
})

const StyledNavLink = styled(NavLink)(navLinkSX)

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  height: theme.height.header,
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: 'none',
  padding: '0 60px 0 0!important',
  zIndex: theme.zIndex.drawer,
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  // [theme.breakpoints.down('md')]: {
  //   position: 'fixed',
  //   bottom: 0,
  //   left: 0,
  //   top: 'unset',
  //   borderTop: '1px solid ' + theme.bgColor.bg4,
  //   justifyContent: 'center'
  // },
  '& .link': {
    textDecoration: 'none',
    fontSize: 14,
    color: theme.palette.text.primary,
    opacity: 0.5,
    marginRight: 48,
    paddingBottom: '30px',
    borderBottom: '2px solid transparent',
    '&.active': {
      opacity: 1,
      borderColor: theme.palette.text.primary
    },
    '&:hover': {
      opacity: 1
    }
  },
  [theme.breakpoints.down('lg')]: {
    '& .link': { marginRight: 15 },
    padding: '0 24px 0 0!important'
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px!important'
  }
}))

const Filler = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    height: theme.height.header,
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px'
  }
}))

const MainLogo = styled(NavLink)(({ theme }) => ({
  '& img': {
    width: 180.8,
    height: 34.7
  },
  '&:hover': {
    cursor: 'pointer'
  },
  [theme.breakpoints.down('sm')]: {
    '& img': { width: 100, height: 'auto' },
    marginBottom: -10
  }
}))

const LinksWrapper = muiStyled('div')(({ theme }) => ({
  marginLeft: 60,
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0
  }
}))

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openReferralModal } = useReferalModal()
  const { account } = useActiveWeb3React()
  const { pathname } = useLocation()

  const handleReferral = useCallback(() => {
    openReferralModal(true)
  }, [openReferralModal])

  const handleMobileMenueDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <StyledAppBar>
        <Box display="flex" alignItems="center">
          <MainLogo id={'antimatter'} to={'/'}>
            <Image src={antimatter} alt={'antimatter'} />
          </MainLogo>
          <HideOnMobile breakpoint="md">
            <LinksWrapper>
              {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
                subTab ? (
                  <Box
                    sx={{
                      marginRight: {
                        xs: 15,
                        lg: 48
                      },
                      height: 'auto',
                      paddingBottom: '29px',
                      borderBottom: '2px solid transparent',
                      borderColor: theme =>
                        title === 'Invest' &&
                        (pathname.includes(routes.chainOption) ||
                          pathname.includes(routes.dualInvest) ||
                          pathname.includes(routes.recurringVault))
                          ? theme.palette.text.primary
                          : 'transparnet',
                      display: 'inline'
                    }}
                    key={title + idx}
                  >
                    <PlainSelect
                      key={title + idx}
                      placeholder={title}
                      autoFocus={false}
                      width={title === 'Invest' ? '70px' : undefined}
                      style={{
                        height: '14px'
                      }}
                    >
                      {subTab.map((sub, idx) =>
                        sub.link ? (
                          <MenuItem
                            key={sub.link + idx}
                            sx={{ backgroundColor: 'transparent!important', background: 'transparent!important' }}
                            selected={false}
                          >
                            <ExternalLink
                              href={sub.link}
                              className={'link'}
                              color="#00000050"
                              sx={{
                                '&:hover': {
                                  color: '#232323!important'
                                }
                              }}
                            >
                              {sub.titleContent ?? sub.title}
                            </ExternalLink>
                          </MenuItem>
                        ) : (
                          <MenuItem key={sub.title + idx}>
                            <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                          </MenuItem>
                        )
                      )}
                    </PlainSelect>
                  </Box>
                ) : link ? (
                  <ExternalLink href={link} className={'link'} key={link + idx} style={{ fontSize: 14 }}>
                    {titleContent ?? title}
                  </ExternalLink>
                ) : title === 'Referral' ? (
                  <React.Fragment key={'referral' + idx}>
                    {account && (
                      <MuiButton
                        disableRipple={true}
                        variant="text"
                        sx={{ padding: 0, marginTop: 'auto', display: 'inline' }}
                        className={'link'}
                        style={{ padding: 0, marginBottom: 0, borderBottom: 0 }}
                        onClick={handleReferral}
                      >
                        {titleContent}
                      </MuiButton>
                    )}
                  </React.Fragment>
                ) : (
                  <NavLink
                    key={title + idx}
                    id={`${route}-nav-link`}
                    to={route ?? ''}
                    className={
                      (route
                        ? pathname.includes(route)
                          ? 'active'
                          : pathname.includes('account')
                          ? route.includes('account')
                            ? 'active'
                            : ''
                          : ''
                        : '') + ' link'
                    }
                  >
                    {titleContent ?? title}
                  </NavLink>
                )
              )}
            </LinksWrapper>
          </HideOnMobile>
        </Box>

        <Box display="flex" alignItems="center" gap={{ xs: '6px', sm: '20px' }}>
          <NetworkSelect />
          <Web3Status />
          <ShowOnMobile breakpoint="md">
            <IconButton
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                height: { xs: 24, sm: 32 },
                width: { xs: 24, sm: 32 },
                mb: { xs: 0, sm: 15 },
                mt: { xs: 0, sm: 8 },
                padding: '4px',
                borderRadius: '8px'
              }}
              onClick={() => {
                setMobileMenuOpen(open => !open)
              }}
            >
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="#252525">
                <path d="M1 1H13" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M1 7H13" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </IconButton>
          </ShowOnMobile>
        </Box>
      </StyledAppBar>
    </>
  )
}
