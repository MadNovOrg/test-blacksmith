import { Meta, StoryObj } from '@storybook/react'

import { FilterByPaymentMethods } from './index'

export default {
  component: FilterByPaymentMethods,
  title: 'components/filters/FilterByPaymentMethods',
} as Meta<typeof FilterByPaymentMethods>

type Story = StoryObj<typeof FilterByPaymentMethods>

export const Default: Story = {
  args: {},
}
