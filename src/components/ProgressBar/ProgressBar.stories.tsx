import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ProgressBar from '.'

export default {
  title: 'components/ProgressBar',
  component: ProgressBar,
} as ComponentMeta<typeof ProgressBar>

const Template: ComponentStory<typeof ProgressBar> = args => {
  return (
    <div className="w-40">
      <ProgressBar {...args} />
    </div>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  percentage: 50,
  textColor: 'text-white',
  fillColor: 'bg-teal-500',
  bgColor: 'bg-gray-100',
  warnColor: 'bg-red',
}
