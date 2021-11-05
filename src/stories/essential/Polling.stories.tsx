import { ComponentMeta } from '@storybook/react'
import { styled } from '@mui/material'
import { Provider } from 'react-redux'
import { Web3ReactProvider } from '@web3-react/core'
import Polling from 'components/essential/Polling'
import getLibrary from 'utils/getLibrary'
import ApplicationUpdater from 'state/application/updater'
import { Web3ProviderNetwork } from 'stories/Header/Header.stories'
import Blocklist from 'components/essential/Blocklist'
import store from 'state'

const Wrapper = styled('div')({
  width: '100%',
  height: 50,
  position: 'relative',
  '& div': {
    position: 'relative'
  }
})

export default {
  title: 'Essential/Polling',
  component: Polling,
  decorator: [
    (Story: any) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Blocklist>
            <Provider store={store}>
              <ApplicationUpdater />
              <Story />
            </Provider>
          </Blocklist>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    )
  ]
} as ComponentMeta<typeof Polling>

export const Default = () => {
  return (
    <Wrapper>
      <Polling />
    </Wrapper>
  )
}
