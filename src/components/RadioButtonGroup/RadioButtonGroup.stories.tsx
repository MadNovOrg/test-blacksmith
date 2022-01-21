import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RadioButtonGroup } from '.'

export default {
  title: 'components/RadioButtonGroup',
  component: RadioButtonGroup,
} as ComponentMeta<typeof RadioButtonGroup>

const Template: ComponentStory<typeof RadioButtonGroup> = args => {
  const [value, setValue] = useState('sms')
  return <RadioButtonGroup {...args} value={value} onChange={setValue} />
}

export const Basic = Template.bind({})

Basic.args = {
  label: 'Select notification type',
  options: [
    {
      label: 'Email',
      value: 'email',
    },
    {
      label: 'Text message',
      value: 'sms',
    },
    {
      label: 'None',
      value: 'none',
    },
  ],
}
