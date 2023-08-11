import type { Meta, StoryObj } from '@storybook/react'

import { InviteUserToOrganisation } from './InviteUserToOrganisation'

const meta: Meta<typeof InviteUserToOrganisation> = {
  title: 'pages/common/profile/components/InviteUserToOrganisation',
  component: InviteUserToOrganisation,
}

export default meta
type Story = StoryObj<typeof InviteUserToOrganisation>

export const Default: Story = {
  args: {},
}
