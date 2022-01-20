import React from 'react'
import { Meta, Story } from '@storybook/react'

import { Button, ButtonProps } from '.'

export default {
  title: 'components/Button',
  component: Button,
} as Meta

const Template: Story<ButtonProps> = args => <Button {...args} />

export const Primary = Template.bind({})

Primary.args = {
  variant: 'primary',
  children: 'primary',
}

export const Secondary = Template.bind({})

Secondary.args = {
  variant: 'secondary',
  children: 'Secondary',
}

export const Tertiary = Template.bind({})

Tertiary.args = {
  variant: 'tertiary',
  children: 'Tertiary',
}

export const TagOne = Template.bind({})

TagOne.args = {
  variant: 'tagOne',
  children: 'Tag One',
}

export const TagTwo = Template.bind({})

TagTwo.args = {
  variant: 'tagTwo',
  children: 'Tag Two',
}
