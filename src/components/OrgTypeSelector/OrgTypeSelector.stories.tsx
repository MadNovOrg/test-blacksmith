import type { Meta, StoryObj } from '@storybook/react'

import { OrgTypeSelector } from './OrgTypeSelector'

export default {
  title: 'components/OrgTypeSelector',
  component: OrgTypeSelector,
  decorators: [],
} as Meta<typeof OrgTypeSelector>

type Story = StoryObj<typeof OrgTypeSelector>

export const Default: Story = {
  args: {},
}
