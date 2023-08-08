import { Meta, StoryObj } from '@storybook/react'

import { FilterByPromoCodeStatus } from './index'

export default {
  component: FilterByPromoCodeStatus,
  title: 'components/filters/FilterByPromoCodeStatus',
} as Meta<typeof FilterByPromoCodeStatus>

type Story = StoryObj<typeof FilterByPromoCodeStatus>

export const Default: Story = {
  args: {},
}
