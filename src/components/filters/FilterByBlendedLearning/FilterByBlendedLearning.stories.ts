import { Meta, StoryObj } from '@storybook/react'

import { FilterByBlendedLearning } from './index'

export default {
  title: 'components/filters/FilterByBlendedLearning',
  component: FilterByBlendedLearning,
} as Meta<typeof FilterByBlendedLearning>

type Story = StoryObj<typeof FilterByBlendedLearning>

export const Default: Story = {
  args: {
    selected: false,
  },
}
