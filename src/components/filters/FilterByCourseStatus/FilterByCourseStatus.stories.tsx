import { Meta, StoryObj } from '@storybook/react'

import { FilterByCourseStatus } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCourseStatus,
  title: 'components/filters/FilterByCourseStatus',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCourseStatus>

type Story = StoryObj<typeof FilterByCourseStatus>

export const Default: Story = {
  args: {},
}
