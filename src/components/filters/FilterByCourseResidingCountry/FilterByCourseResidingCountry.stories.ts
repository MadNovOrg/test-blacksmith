import { Meta, StoryObj } from '@storybook/react'

import { FilterByCourseResidingCountry } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCourseResidingCountry,
  title: 'components/filters/FilterByCourseResidingCountry',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCourseResidingCountry>

type Story = StoryObj<typeof FilterByCourseResidingCountry>

export const Default: Story = {}
