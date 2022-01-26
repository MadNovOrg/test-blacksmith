import React from 'react'
import { Meta, Story } from '@storybook/react'
import { nanoid } from 'nanoid'

import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup'

export default {
  title: 'components/CheckboxGroup',
  component: CheckboxGroup,
} as Meta

const Template: Story<CheckboxGroupProps> = args => {
  return (
    <div className="flex justify-center">
      <CheckboxGroup {...args} />
    </div>
  )
}

export const checkboxGroup = Template.bind({})

checkboxGroup.args = {
  items: [
    { id: nanoid(), text: 'Test text 1' },
    { id: nanoid(), text: 'Test text 1' },
    { id: nanoid(), text: 'Test text 1' },
  ],
  error: false,
}
