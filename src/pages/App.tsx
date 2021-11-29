import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import WarningModal from '../components/Modal/WarningModal'
// import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
import DualInvest from './DualInvest'
import DualInvestMgmt from './DualInvestMgmt'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%',
  maxHeight: '100vh',
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
  overflowX: 'hidden',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`
  }
}))

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
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path={routes.dualInvest} component={DualInvest} />
                  <Route exact strict path={routes.dualInvestMgmt} component={DualInvestMgmt} />
                </Switch>
              </Web3ReactManager>
            </BodyWrapper>
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}
