import React from 'react'
import { Meta, Story } from '@storybook/react'

import { Checkbox, CheckboxProps } from './Checkbox'

export default {
  title: 'components/Checkbox',
  component: Checkbox,
} as Meta

const Template: Story<CheckboxProps> = args => {
  return (
    <div className="flex justify-center">
      <Checkbox {...args} />
    </div>
  )
}

export const checkbox = Template.bind({})

checkbox.args = {
  id: '1',
  text: 'Sample text',
  error: false,
}
