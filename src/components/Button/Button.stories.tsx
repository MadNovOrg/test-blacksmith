import React from 'react'
import { Meta, Story } from '@storybook/react'

import { Button, ButtonProps } from '.'

export default {
  title: 'components/Button',
  component: Button,
} as Meta

const ButtonTemplate: Story<ButtonProps> = args => (
  <div className="flex gap-4">
    <Button {...args} />
    <Button {...args} disabled />
  </div>
)

const TagTemplate: Story<ButtonProps> = args => <Button {...args} />

export const Primary = ButtonTemplate.bind({})

Primary.args = {
  variant: 'primary',
  children: 'primary',
}

export const Secondary = ButtonTemplate.bind({})

Secondary.args = {
  variant: 'secondary',
  children: 'Secondary',
}

export const Tertiary = ButtonTemplate.bind({})

Tertiary.args = {
  variant: 'tertiary',
  children: 'Tertiary',
}

export const TagOne = TagTemplate.bind({})

TagOne.args = {
  variant: 'tagOne',
  children: 'Tag One',
}

export const TagTwo = TagTemplate.bind({})

TagTwo.args = {
  variant: 'tagTwo',
  children: 'Tag Two',
}
