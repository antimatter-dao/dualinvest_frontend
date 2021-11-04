import { SwitchTabWrapper, Tab } from 'components/SwitchTab'
import { routes } from 'constants/routes'
import { useState } from 'react'

export default {
  title: 'SwitchTab/SwitchTab'
}

export const Default = () => {
  const [currentTab, setCurrentTab] = useState('test1')
  return (
    <SwitchTabWrapper>
      {Object.keys(routes).map(route => {
        return (
          <Tab
            key={route}
            onClick={() => {
              setCurrentTab(route)
            }}
            selected={currentTab === route}
          >
            {route}
          </Tab>
        )
      })}
    </SwitchTabWrapper>
  )
}
