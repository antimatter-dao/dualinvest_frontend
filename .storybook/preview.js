import theme, { ThemeProvider } from '../src/theme/muiTheme'
import { ModalProvider } from '../src/context/ModalContext'

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

    <ThemeProvider theme={theme}>
      <ModalProvider>
        <Story />
      </ModalProvider>
    </ThemeProvider>
  ),
];