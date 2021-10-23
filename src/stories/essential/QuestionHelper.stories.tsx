import { ComponentMeta } from '@storybook/react'
import QuestionHelper from 'components/essential/QuestionHelper'

export default {
  title: 'Essential/QuestionHelper',
  component: QuestionHelper
} as ComponentMeta<typeof QuestionHelper>

export const Default = (args: any) => {
  return (
    <QuestionHelper
      text={args.text || 'Bypasses confirmation modals and allows high slippage trades. Use at your own risk.'}
    />
  )
}
