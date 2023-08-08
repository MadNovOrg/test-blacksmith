import { Meta, StoryObj } from '@storybook/react'

import { FilterByDates } from './index'

import withi18nProvider from '@storybook-decorators/withi18nProvider'
import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByDates,
  title: 'components/filters/FilterByDates',
  decorators: [withi18nProvider, withRouterProvider],
} as Meta<typeof FilterByDates>

type Story = StoryObj<typeof FilterByDates>

export const Default: Story = {
  args: { title: 'Title' },
}
