import { ChevronDown } from 'react-feather'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { darken } from 'polished'
import { CountUp } from 'use-count-up'
import { Typography, useTheme } from '@material-ui/core'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
import { useAggregateUniBalance } from '../../state/wallet/hooks'
import { ExternalLink } from '../../theme'
import Row, { RowFixed, RowBetween } from '../Row'
import Web3Status from './Web3Status'
import usePrevious from '../../hooks/usePrevious'
import { ReactComponent as Logo } from '../../assets/svg/antimatter_logo.svg'
import { TokenAmount } from '../../constants/token/fractions'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const tabs: Tab[] = [
  { title: 'Test1', route: '/' },
  { title: 'Test2', route: '/' },
  { title: 'Test3', route: '/' },
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

export const headerHeightDisplacement = '32px'

const HeaderFrame = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  width: 100%;
  top: 0;
  height: ${({ theme }) => theme.headerHeight}
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.text5};
  padding: 27px 0 0;
  z-index: 5;
  background-color:${({ theme }) => theme.bg1}
  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: 100%;
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-self: flex-end;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: ${theme.headerHeight};
    flex-direction: row;
    align-items: center;
    justify-self: center;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    background-color: ${theme.bg2};
    justify-content: center;
    border-top: 1px solid;
    border-top-color: #303030;
  `};
`

const HeaderRow = styled(RowFixed)`
  width: 100%;
  min-width: 1100px;
  padding-left: 2rem;
  align-items: flex-start
    ${({ theme }) => theme.mediaWidth.upToLarge`
    background: red
   align-items: center
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  width: auto;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
    display: none
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  border-radius: 4px;
  white-space: nowrap;
  cursor: pointer;
  padding: ${({ active }) => (active ? '7px 12px' : 'unset')};
  border: 1px solid ${({ theme, active }) => (active ? theme.text1 : 'transparent')};
`

const UNIAmount = styled.div`
  color: white;
  font-size: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  &:after {
    content: '';
    border-right: 1px solid ${({ theme }) => theme.text1};
    margin: 0 16px;
    height: 16px;
  }
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  width: fit-content;
  margin: 0 20px;
  font-weight: 400;
  padding: 10px 0 27px;
  white-space: nowrap;
  transition: 0.5s;
  ${({ theme }) => theme.flexRowNoWrap}
  &.${activeClassName} {
    color: ${({ theme }) => theme.primary1};
    border-bottom: 1px solid ${({ theme }) => theme.primary1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
`

const StyledDropdown = styled.div`
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  width: fit-content;
  margin: 0 20px;
  font-weight: 400;
  padding: 10px 0 27px;
  transition: 0.5s;
  position: relative;
  svg {
    margin-left: 5px;
  }
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.primary1)};
    svg {
      transform: rotate(180deg);
    }
    & > div {
      top: 40px;
      height: auto;
      border: 1px solid ${({ theme }) => theme.text5};
    }
  }
  ${({ theme }) => theme.flexRowNoWrap}
`
const Dropdown = styled.div`
  z-index: 3;
  height: 0;
  position: absolute;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 172px;
  a {
    color: #ffffff;
    background-color: ${({ theme }) => theme.bg2};
    text-decoration: none;
    padding: 14px 17px;
    border-bottom: 1px solid ${({ theme }) => theme.text5}
    transition: 0.5s;
    display: flex;
    align-items: center;
    :last-child{
      border: none;
    }
    :hover {
      background-color: ${({ theme }) => theme.bg4};
      color: ${({ theme }) => darken(0.1, theme.primary1)};
    }
  }
`

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

const StyledLogo = styled(Logo)`
  margin-right: 60px;
`

function FAQButton() {
  const theme = useTheme()
  return (
    <RowFixed>
      <RowFixed
        justify="center"
        style={{
          borderRadius: '50%',
          border: `1px solid ${theme.palette.primary.main}`,
          width: '18px',
          height: '18px',
          marginRight: '12px',
          color: theme.palette.primary.main
        }}
      >
        <Typography variant="body1">?</Typography>
      </RowFixed>
      FAQ
    </RowFixed>
  )
}

const MobileHeader = styled.header`
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items: center;
  padding: 0 24px;
  position:relative;
  background-color: ${({ theme }) => theme.bg1}
  height:${({ theme }) => theme.mobileHeaderHeight}
  position:fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: inherit
`};
`

export default function Header() {
  const { account } = useActiveWeb3React()

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame>
      <HeaderRow>
        <Link to={'/'}>
          <StyledLogo />
        </Link>
        <HeaderLinks>
          {tabs.map(({ title, route, link, subTab }) => {
            if (subTab) {
              return (
                <StyledDropdown key={title}>
                  {title}
                  <ChevronDown size={15} />
                  <Dropdown>
                    {subTab.map(({ title, route, link, titleContent }) => {
                      return link ? (
                        <ExternalLink href={link} key={title}>
                          {titleContent ?? title}
                        </ExternalLink>
                      ) : route ? (
                        <NavLink to={route} key={title}>
                          {titleContent ?? title}
                        </NavLink>
                      ) : null
                    })}
                  </Dropdown>
                </StyledDropdown>
              )
            }
            if (route === 'option_exercise') {
              return (
                <StyledNavLink
                  key={route}
                  to={`/${route}`}
                  isActive={(match, { pathname }) =>
                    Boolean(match) || pathname.startsWith('/generate') || pathname.startsWith('/redeem')
                  }
                >
                  {title}
                </StyledNavLink>
              )
            }
            return (
              <>
                {link ? (
                  <ExternalLink href={link} key={title}>
                    {title}
                  </ExternalLink>
                ) : (
                  <StyledNavLink id={`stake-nav-link`} to={'/' + route} key={route}>
                    {title}
                  </StyledNavLink>
                )}
              </>
            )
          })}
        </HeaderLinks>
        <div style={{ paddingLeft: 8, display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '2rem' }}>
          <HeaderControls>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {!!account && aggregateBalance && (
                <UNIWrapper>
                  <UNIAmount style={{ pointerEvents: 'none' }}>
                    {account && (
                      <Text
                        style={{
                          paddingRight: '.4rem'
                        }}
                      >
                        <CountUp
                          key={countUpValue}
                          isCounting
                          start={parseFloat(countUpValuePrevious)}
                          end={parseFloat(countUpValue)}
                          thousandsSeparator={','}
                          duration={1}
                        />
                      </Text>
                    )}
                    MATTER
                  </UNIAmount>
                </UNIWrapper>
              )}
              <Web3Status />
            </AccountElement>
          </HeaderControls>
        </div>
      </HeaderRow>
      <MobileHeader>
        <RowBetween>
          <Link to={'/'}>
            <StyledLogo />
          </Link>
        </RowBetween>
      </MobileHeader>
    </HeaderFrame>
  )
}
