import { Meta, StoryObj } from '@storybook/react'

import { FilterByCurrencies } from './index'

export default {
  component: FilterByCurrencies,
  title: 'components/filters/FilterByCurrencies',
} as Meta<typeof FilterByCurrencies>

type Story = StoryObj<typeof FilterByCurrencies>

export const Default: Story = {
  args: {},
}
