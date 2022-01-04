import { Suspense, useEffect } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import WarningModal from '../components/Modal/WarningModal'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
import DualInvest from './DualInvest'
import DualInvestMgmt from './DualInvestMgmt'
import NoService from './NoService'
import Spinner from 'components/Spinner'
import { fetchLocation } from 'utils/fetch/location'
import Account from './Account'
import { BindModalProvider } from 'context/BindContext'
import Home from './Home'
import ChainOption from './ChainOption'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'auto',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
    // height: '100vh'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%',
  // maxHeight: '100vh',
  overflow: 'auto',
  alignItems: 'center'
})

const BodyWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: `calc(100vh - ${theme.height.header})`,
  padding: '0 0 80px',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'auto',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh  - ${theme.height.mobileHeader})`
  }
}))

const resource = fetchLocation()

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app">
          <ContentWrapper>
            <Header />
            <BodyWrapper id="body">
              <Popups />
              <Polling />
              <WarningModal />
              <ScrollToTop />
              <Web3ReactManager>
                <BindModalProvider>
                  <LocatoinVerification resource={resource}>
                    <Switch>
                      <Route exact strict path={routes.home} component={Home} />
                      <Route exact strict path={routes.chainOption} component={ChainOption} />
                      <Route exact strict path={routes.noService} component={NoService} />
                      <Route exact strict path={routes.account} component={Account} />
                      <Route exact strict path={routes.referral} component={DualInvest} />
                      <Route exact strict path={routes.dualInvest} component={DualInvest} />
                      <Route exact strict path={routes.dualInvestMgmt} component={DualInvestMgmt} />
                      <Route exact strict path={routes.dualInvestMgmtImg} component={DualInvestMgmt} />
                      <Route path="/">
                        <Redirect to={routes.home} />
                      </Route>
                    </Switch>
                  </LocatoinVerification>
                </BindModalProvider>
              </Web3ReactManager>
            </BodyWrapper>
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}

function LocatoinVerification({ resource, children }: { resource: { read(): any }; children: React.ReactNode }) {
  const location = resource.read()

  return (
    <Suspense fallback={<Spinner size={100} />}>
      {location === 'US' || location === 'CN' || !location ? <NoService /> : children}
      {/*{location === 'US' || location === 'CN' || !location || location === 'Not found' ? children : children}*/}
    </Suspense>
  )
}

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
