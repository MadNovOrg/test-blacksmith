import type { Meta, StoryObj } from '@storybook/react'

import { EditRoles } from './EditRoles'

const meta: Meta<typeof EditRoles> = {
  title: 'pages/common/profile/components/EditRoles',
  component: EditRoles,
}

export default meta
type Story = StoryObj<typeof EditRoles>

export const Default: Story = {
  args: {},
}
