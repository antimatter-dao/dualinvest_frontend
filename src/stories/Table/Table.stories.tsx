import { ComponentMeta } from '@storybook/react'

import Table from 'components/Table'

export default {
  title: 'Table/Table',
  component: Table
} as ComponentMeta<typeof Table>

export const Default = () => (
  <Table
    header={['Dessert (100g serving)', 'Calories', 'Fat (g)', 'Carbs (g)', 'Protein (g)']}
    rows={[
      ['Frozen yoghurt', 159, 6.0, 24, 4.0],
      ['Ice cream sandwich', 237, 9.0, 37, 4.3],
      ['Eclair', 262, 16.0, 24, 6.0],
      ['Cupcake', 305, 3.7, 67, 4.3],
      ['Gingerbread', 356, 16.0, 49, 3.9]
    ]}
  />
)
