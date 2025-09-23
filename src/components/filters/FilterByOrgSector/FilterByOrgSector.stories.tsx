import { Meta, StoryObj } from '@storybook/react'

import { FilterByOrgSector } from './index'

export default {
  component: FilterByOrgSector,
  title: 'components/filters/FilterByOrgSector',
} as Meta<typeof FilterByOrgSector>

type Story = StoryObj<typeof FilterByOrgSector>

export const Default: Story = {
  args: {},
}
