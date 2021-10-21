import theme, { ThemeProvider as MuiThemeProvider } from '../src/theme/muiTheme'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from '../src/theme'
import { ModalProvider } from '../src/context/ModalContext'
import { Provider } from 'react-redux'
import store from '../src/state'

export const parameters = {
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: theme.palette.grey[500],
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
        <MuiThemeProvider theme={theme}>
          <FixedGlobalStyle />
          <ThemedGlobalStyle />
          <ModalProvider>
            <Story />
          </ModalProvider>
        </MuiThemeProvider>
      </ThemeProvider>
    </Provider>
  ),
];