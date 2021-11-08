import { ComponentMeta } from '@storybook/react'
import { styled } from '@mui/material'
import { Provider } from 'react-redux'
import Polling from 'components/essential/Polling'
import ApplicationUpdater from 'state/application/updater'

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
      <Blocklist>
        <Provider store={store}>
          <ApplicationUpdater />
          <Story />
        </Provider>
      </Blocklist>
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
