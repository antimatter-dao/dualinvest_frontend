import { ComponentMeta } from '@storybook/react'

import Stepper from 'components/Stepper'
import { useState } from 'react'

export default {
  title: 'Others/Stepper',
  component: Stepper
} as ComponentMeta<typeof Stepper>

export const Default = () => {
  const [currentStep, setCurrentStep] = useState(1)
  return <Stepper activeStep={currentStep} steps={[1, 2, 3]} onStep={step => setCurrentStep(step)} />
}
