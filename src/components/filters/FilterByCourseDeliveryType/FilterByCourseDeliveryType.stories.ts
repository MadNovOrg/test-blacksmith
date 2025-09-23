import { Meta, StoryObj } from '@storybook/react'

import { FilterByCourseDeliveryType } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCourseDeliveryType,
  title: 'components/filters/FilterByCourseDeliveryType',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCourseDeliveryType>

type Story = StoryObj<typeof FilterByCourseDeliveryType>

export const Default: Story = {
  args: {},
}
