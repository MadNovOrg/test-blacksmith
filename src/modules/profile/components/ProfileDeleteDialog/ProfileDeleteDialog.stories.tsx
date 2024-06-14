import type { Meta, StoryObj } from '@storybook/react'

import { ProfileDeleteDialog } from './ProfileDeleteDialog'

const meta: Meta<typeof ProfileDeleteDialog> = {
  title: 'pages/common/profile/components/ProfileDeleteDialog',
  component: ProfileDeleteDialog,
}

export default meta
type Story = StoryObj<typeof ProfileDeleteDialog>

export const Default: Story = {
  args: {},
}
