import { Meta, StoryObj } from '@storybook/react'

import { FilterByReaccreditation } from './index'

export default {
  component: FilterByReaccreditation,
  title: 'components/filters/FilterByReaccreditation',
} as Meta<typeof FilterByReaccreditation>

type Story = StoryObj<typeof FilterByReaccreditation>

export const Default: Story = {
  args: {
    selected: false,
  },
}
