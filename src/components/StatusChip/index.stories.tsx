import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { StatusChip } from '.'

export default {
  title: 'components/StatusChip',
  component: StatusChip,
} as ComponentMeta<typeof StatusChip>

const Template: ComponentStory<typeof StatusChip> = args => {
  return <StatusChip {...args} />
}

export const Basic = Template.bind({})
