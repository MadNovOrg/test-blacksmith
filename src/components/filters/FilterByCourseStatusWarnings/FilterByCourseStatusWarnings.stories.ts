import { Meta, StoryObj } from '@storybook/react'

import { FilterByCourseStatusWarnings } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCourseStatusWarnings,
  title: 'components/filters/FilterByCourseStatusWarnings',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCourseStatusWarnings>

type Story = StoryObj<typeof FilterByCourseStatusWarnings>

export const Default: Story = {
  args: {},
}
