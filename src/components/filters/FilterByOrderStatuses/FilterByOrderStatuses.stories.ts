import { Meta, StoryObj } from '@storybook/react'

import { FilterByOrderStatuses } from './index'

export default {
  component: FilterByOrderStatuses,
  title: 'components/filters/FilterByOrderStatuses',
} as Meta<typeof FilterByOrderStatuses>

type Story = StoryObj<typeof FilterByOrderStatuses>

export const Default: Story = {
  args: {},
}
