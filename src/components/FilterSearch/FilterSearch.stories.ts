import { Meta, StoryObj } from '@storybook/react'

import { FilterSearch } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterSearch,
  title: 'components/filters/FilterSearch',
  decorators: [withRouterProvider],
} as Meta<typeof FilterSearch>

type Story = StoryObj<typeof FilterSearch>

export const Default: Story = {
  args: {
    fullWidth: true,
  },
}
