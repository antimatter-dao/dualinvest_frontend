import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, useTheme, AppBar, Box, MenuItem, styled as muiStyled, makeStyles } from '@material-ui/core'
import { ExternalLink } from '../../theme'
import Web3Status from './Web3Status'
import SelectedIcon from '../../assets/componentsIcon/selected_icon.svg'
import { HideOnMobile } from 'theme/muiTheme'
import PlainSelect from 'components/Select/PlainSelect'

import Image from 'components/Image'
import ChainSwap from '../../assets/svg/chain_swap.svg'
import { routes } from 'constants/routes'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

const Tabs: Tab[] = [
  { title: 'Test1', route: routes.test1 },
  { title: 'Test2', route: routes.test2 },
  { title: 'Test3', route: routes.test3 },
  { title: 'Test4', link: 'https://www.google.com/' },
  {
    title: 'About',
    subTab: [
      { title: 'About1', link: 'https://www.google.com/' },
      { title: 'About2', link: 'https://www.google.com/' },
      {
        title: 'faq',
        titleContent: <FAQButton />,
        route: 'faq'
      }
    ]
  }
]

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: theme.height.header,
    backgroundColor: theme.palette.background.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 'none',
    padding: '0 60px 00 40px',
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      top: 'unset',
      borderTop: '1px solid ' + theme.bgColor.bg4,
      justifyContent: 'center'
    }
  },
  actionButton: {
    [theme.breakpoints.down('md')]: {
      maxWidth: 320,
      width: '100%',
      borderRadius: 49,
      height: 40
    }
  },
  mainLogo: {
    '& img': {
      width: 180.8,
      height: 34.7
    },
    '&:hover': {
      cursor: 'pointer'
    }
  },
  navLink: {
    textDecoration: 'none',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.5,
    marginRight: 28,
    '&.active': {
      opacity: 1
    },
    '&:hover': {
      opacity: 1
    }
  },
  menuItem: {
    '&::before': {
      content: '""',
      width: 30,
      height: 20,
      display: 'flex',
      justifyContent: 'center'
    },
    '&.Mui-selected::before': {
      content: `url(${SelectedIcon})`,
      width: 30,
      height: 20,
      display: 'flex',
      justifyContent: 'center'
    }
  }
}))

const LinksWrapper = muiStyled('div')({
  marginLeft: 60.2
})

export default function Header() {
  const classes = useStyles()
  return (
    <AppBar className={classes.root}>
      <HideOnMobile>
        <Box display="flex" alignItems="center">
          <NavLink id={'chainswap'} to={'/'} className={classes.mainLogo}>
            <Image src={ChainSwap} alt={'chainswap'} />
          </NavLink>
          <LinksWrapper>
            {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
              subTab ? (
                <PlainSelect placeholder="about" key={title + idx}>
                  {subTab.map((sub, idx) =>
                    sub.link ? (
                      <MenuItem key={sub.link + idx}>
                        <ExternalLink href={sub.link} className={classes.navLink}>
                          {sub.titleContent ?? sub.title}
                        </ExternalLink>
                      </MenuItem>
                    ) : (
                      <MenuItem key={sub.title + idx}>
                        <NavLink to={sub.route ?? ''} className={classes.navLink}>
                          {sub.titleContent ?? sub.title}
                        </NavLink>
                      </MenuItem>
                    )
                  )}
                </PlainSelect>
              ) : link ? (
                <ExternalLink href={link} className={classes.navLink} key={link + idx}>
                  {titleContent ?? title}
                </ExternalLink>
              ) : (
                <NavLink key={title + idx} id={`${route}-nav-link`} to={route ?? ''} className={classes.navLink}>
                  {titleContent ?? title}
                </NavLink>
              )
            )}
          </LinksWrapper>
        </Box>
      </HideOnMobile>
      <Web3Status />
    </AppBar>
  )
}

function FAQButton() {
  const theme = useTheme()
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: `1px solid ${theme.palette.success.main}`,
          width: '18px',
          height: '18px',
          marginRight: '12px',
          color: theme.palette.success.main
        }}
      >
        <Typography variant="body1">?</Typography>
      </span>
      FAQ
    </Box>
  )
}
