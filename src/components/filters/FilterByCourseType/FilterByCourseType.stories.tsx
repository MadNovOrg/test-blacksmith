import { Meta, StoryObj } from '@storybook/react'

import { FilterByCourseType } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCourseType,
  title: 'components/filters/FilterByCourseType',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCourseType>

type Story = StoryObj<typeof FilterByCourseType>

export const Default: Story = {
  args: {},
}
