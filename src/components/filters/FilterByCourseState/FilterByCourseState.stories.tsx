import { Meta, StoryObj } from '@storybook/react'

import { FilterByCourseState } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCourseState,
  title: 'components/filters/FilterByCourseState',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCourseState>

type Story = StoryObj<typeof FilterByCourseState>

export const Default: Story = {
  args: {},
}
