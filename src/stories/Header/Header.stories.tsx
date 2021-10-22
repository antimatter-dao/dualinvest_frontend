import { ComponentMeta } from '@storybook/react'
import { HashRouter } from 'react-router-dom'
import HeaderComponent from 'components/Header'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import getLibrary from 'utils/getLibrary'
import { NetworkContextName } from 'constants/index'
import Web3ReactManager from 'components/Web3ReactManager'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
export default {
  title: 'Header/Header',
  component: HeaderComponent,
  decorators: [
    Story => {
      return (
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <HashRouter>
                <Story />
              </HashRouter>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      )
    }
  ]
} as ComponentMeta<typeof HeaderComponent>

export const Default = () => {
  return <HeaderComponent />
}
