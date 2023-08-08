import { Meta, StoryObj } from '@storybook/react'

import { FilterByPromoCodeType } from './index'

export default {
  component: FilterByPromoCodeType,
  title: 'components/filters/FilterByPromoCodeType',
} as Meta<typeof FilterByPromoCodeType>

type Story = StoryObj<typeof FilterByPromoCodeType>

export const Default: Story = {
  args: {},
}
