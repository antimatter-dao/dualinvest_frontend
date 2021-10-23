import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import { StrictMode } from 'react'
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@material-ui/core'
import ReactDOM from 'react-dom'
// import ReactGA from 'react-ga'
import theme from 'theme/muiTheme'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import Blocklist from './components/essential/Blocklist'
import { NetworkContextName } from './constants'
import App from './pages/App'
import store from './state'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import ThemeProvider from './theme'
import getLibrary from './utils/getLibrary'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

// const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
// if (typeof GOOGLE_ANALYTICS_ID === 'string') {
//   ReactGA.initialize(GOOGLE_ANALYTICS_ID)
//   ReactGA.set({
//     customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
//   })
// } else {
//   ReactGA.initialize('test', { testMode: true, debug: true })
// }

// window.addEventListener('error', error => {
//   ReactGA.exception({
//     description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
//     fatal: true
//   })
// })

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Blocklist>
          <Provider store={store}>
            <Updaters />
            <ThemeProvider>
              <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <HashRouter>
                  <App />
                </HashRouter>
              </MuiThemeProvider>
            </ThemeProvider>
          </Provider>
        </Blocklist>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.unregister()
