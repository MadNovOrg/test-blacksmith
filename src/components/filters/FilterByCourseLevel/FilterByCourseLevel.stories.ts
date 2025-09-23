import { Meta, StoryObj } from '@storybook/react'

import { FilterByCourseLevel } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCourseLevel,
  title: 'components/filters/FilterByCourseLevel',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCourseLevel>

type Story = StoryObj<typeof FilterByCourseLevel>

export const Default: Story = {
  args: { title: 'title' },
}
