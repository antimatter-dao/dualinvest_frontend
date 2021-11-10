import theme, { ThemeProvider as MuiThemeProvider, theme as themeColor } from '../src/theme/index'
import { ModalProvider } from '../src/context/ModalContext'
import { Provider } from 'react-redux'
import store from '../src/state'
import { CssBaseline } from '@mui/material'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import getLibrary from 'utils/getLibrary'
import { NetworkContextName } from 'constants/index'
import Web3ReactManager from 'components/essential/Web3ReactManager'

export const parameters = {
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: themeColor.palette.background.default
      }
    ]
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

export const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

export const decorators = [
  Story => (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Web3ReactManager>
          <Provider store={store}>
            <MuiThemeProvider theme={theme}>
              <CssBaseline />
              <ModalProvider>
                <Story />
              </ModalProvider>
            </MuiThemeProvider>
          </Provider>
        </Web3ReactManager>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  )
]
