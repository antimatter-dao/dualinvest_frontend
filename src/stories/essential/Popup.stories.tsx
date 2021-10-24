import { ComponentMeta } from '@storybook/react'
import { useEffect } from 'react'
import Popups from 'components/essential/Popups'
import { useAddPopup } from 'state/application/hooks'

export default {
  title: 'Essential/Popups',
  component: Popups
} as ComponentMeta<typeof Popups>

export const Default = () => {
  const addPopup = useAddPopup()
  useEffect(() => {
    addPopup(
      {
        txn: {
          hash: 'TEST1',
          success: true,
          summary: 'test1'
        }
      },
      '12'
    )
    addPopup(
      {
        txn: {
          hash: 'TEST2',
          success: false,
          summary: 'test2'
        }
      },
      '2'
    )
    const id = setInterval(() => {
      addPopup(
        {
          txn: {
            hash: Math.random() + '',
            success: true,
            summary: 'test1'
          }
        },
        '12'
      )
      addPopup(
        {
          txn: {
            hash: Math.random() + '',
            success: false,
            summary: 'test2'
          }
        },
        '2'
      )
    }, 500)
    return () => clearInterval(id)
  }, [addPopup])

  return <Popups />
}
