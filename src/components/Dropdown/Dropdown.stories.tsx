import React from 'react'
import { Meta, Story } from '@storybook/react'

import { Dropdown, DropdownProps } from '../Dropdown'

export default {
  title: 'components/Dropdown',
  component: Dropdown,
} as Meta

const Template: Story<DropdownProps> = args => {
  return (
    <div className="flex items-center justify-center p-12">
      <Dropdown {...args} />
    </div>
  )
}

export const dropdown = Template.bind({})

dropdown.args = {
  title: 'Please Choose',
  items: ['Choice 1', 'Choice 2', 'Choice 3'],
  handleClick: item => {
    alert(`This is just a test behaviour on click for ${item}`)
  },
}
