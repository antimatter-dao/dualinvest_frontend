import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, css, DefaultTheme } from 'styled-components'
import { Colors } from './styled'

export * from './components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 600,
  upToSmall: 900,
  upToMedium: 1200,
  upToLarge: 1536
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export const colors: Colors = {
  // base
  white,
  black,

  // text
  text1: '#FFFFFF',
  text2: '#CCCCCC',
  text3: '#999999',
  text4: '#727272',
  text5: '#333333',

  // backgrounds / greys
  bg1: '#000000',
  bg2: '#191919',
  bg3: '#252525',
  bg4: '#303030',
  bg5: '#A1A1A1',

  //specialty colors
  modalBG: 'rgba(0,0,0,.7)',
  advancedBG: 'rgba(0,0,0,0.1)',

  //primary colors
  primary1: '#9867FF',
  primary2: '#9867FF',
  primary3: '#7433FF',
  primary4: '#3E276B',
  primary5: '#2E2247',

  // color text
  primaryText1: '#9867FF',

  // secondary colors
  secondary1: '#3E276B',
  secondary2: '#211735',
  secondary3: '#1D152D',

  // other
  red1: '#F53030',
  green1: '#2DAB50',

  translucent: 'rgba(255, 255, 255, 0.08)',
  gradient1:
    '#000000 linear-gradient(283.31deg, rgba(255, 255, 255, 0.18) -2.53%, rgba(255, 255, 255, 0.17) 18.66%, rgba(255, 255, 255, 0) 98.68%)',
  gradient2: '#000000 linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)'
}

export function theme(): DefaultTheme {
  return {
    ...colors,

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: '#000',

    // media queries
    mediaWidth: mediaWidthTemplates,

    //rwd
    mobile: css`
      display: none;
      ${mediaWidthTemplates.upToSmall`display:inherit;`}
    `,
    desktop: css`
      ${mediaWidthTemplates.upToSmall`display:none;`}
    `,
    mobileHeaderHeight: '90px',
    headerHeight: '82px',
    footerHeight: '60px',

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <StyledComponentsThemeProvider theme={theme}>{children}</StyledComponentsThemeProvider>
}
