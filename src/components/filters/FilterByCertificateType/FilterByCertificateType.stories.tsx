import { Meta, StoryObj } from '@storybook/react'

import { FilterByCertificateType } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCertificateType,
  title: 'components/filters/FilterByCertificateType',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCertificateType>

type Story = StoryObj<typeof FilterByCertificateType>

export const Default: Story = {
  args: {},
}
