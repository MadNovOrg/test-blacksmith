import { Meta, StoryObj } from '@storybook/react'

import { FilterByCertificateValidity } from './index'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  component: FilterByCertificateValidity,
  title: 'components/filters/FilterByCertificateValidity',
  decorators: [withRouterProvider],
} as Meta<typeof FilterByCertificateValidity>

type Story = StoryObj<typeof FilterByCertificateValidity>

export const Default: Story = {
  args: {},
}
