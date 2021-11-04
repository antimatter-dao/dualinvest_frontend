import { ComponentMeta } from '@storybook/react'

import Pagination from 'components/Pagination'
import { useState } from 'react'

export default {
  title: 'Pagination/Pagination',
  component: Pagination
} as ComponentMeta<typeof Pagination>

export const Default = () => {
  const [curPage, setCurPage] = useState(4)
  return (
    <Pagination
      count={20}
      page={curPage}
      setPage={num => {
        setCurPage(num)
      }}
    />
  )
}
