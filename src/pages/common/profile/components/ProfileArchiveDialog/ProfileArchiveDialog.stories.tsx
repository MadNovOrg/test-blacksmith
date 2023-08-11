import type { Meta, StoryObj } from '@storybook/react'

import { ProfileArchiveDialog } from './ProfileArchiveDialog'

const meta: Meta<typeof ProfileArchiveDialog> = {
  title: 'pages/common/profile/components/ProfileArchiveDialog',
  component: ProfileArchiveDialog,
}

export default meta
type Story = StoryObj<typeof ProfileArchiveDialog>

export const Default: Story = {
  args: {},
}
