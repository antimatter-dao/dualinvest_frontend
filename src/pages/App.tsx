import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import WarningModal from '../components/muiModal/WarningModal'
import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'

const AppWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-x: hidden;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  height: 100vh;
  `}
`
const ContentWrapper = styled.div`
  width: 100%;
  max-height: 100vh;
  overflow: auto;
  align-items: center;
`

const HeaderWrapper = styled.div`
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  ${({ theme }) => theme.flexRowNoWrap}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  height:0;
  overflow: hidden
  `}
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight});
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-bottom: ${({ theme }) => theme.headerHeight}
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top: ${({ theme }) => theme.mobileHeaderHeight}
  `};
`

export const Marginer = styled.div`
  ${({ theme }) => theme.desktop}
`

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app">
          {/* <URLWarning /> */}
          <ContentWrapper>
            <HeaderWrapper id="header">
              <Header />
            </HeaderWrapper>
            <BodyWrapper id="body">
              <Popups />
              <Polling />
              <WarningModal />
              {/* <TopLevelModals /> */}
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/test1" component={ComingSoon} />
                </Switch>
              </Web3ReactManager>
              {/* <Marginer /> */}
            </BodyWrapper>
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}
