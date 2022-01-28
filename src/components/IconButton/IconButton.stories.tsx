import React from 'react'
import { Meta, Story } from '@storybook/react'

import { IconButton, IconButtonProps } from '.'

export default {
  title: 'components/IconButton',
  component: IconButton,
} as Meta

const IconButtonTemplate: Story<IconButtonProps> = args => (
  <IconButton {...args} />
)

export const Sample1 = IconButtonTemplate.bind({})

Sample1.args = {
  name: 'lightbulb',
  onClick: () => console.log('CLICKED'),
}

export const Sample2 = IconButtonTemplate.bind({})

Sample2.args = {
  name: 'arrow-right',
  onClick: () => console.log('CLICKED'),
}
