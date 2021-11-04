import theme, { ThemeProvider as MuiThemeProvider, ThemeProvider5 } from '../src/theme/muiTheme'
import ThemeProvider from '../src/theme'
import { ModalProvider } from '../src/context/ModalContext'
import { Provider } from 'react-redux'
import store from '../src/state'
import { CssBaseline } from '@mui/material'

export const parameters = {
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: theme.palette.background.default,
      }
    ],
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <ThemeProvider>
        <ThemeProvider5>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <ModalProvider>
              <Story />
            </ModalProvider>
          </MuiThemeProvider>
        </ThemeProvider5>
      </ThemeProvider>
    </Provider>
  ),
];