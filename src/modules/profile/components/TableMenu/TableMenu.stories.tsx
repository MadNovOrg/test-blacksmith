import type { Meta, StoryObj } from '@storybook/react'

import { TableMenu } from './TableMenu'

const meta: Meta<typeof TableMenu> = {
  title: 'pages/common/profile/components/TableMenu',
  component: TableMenu,
}

export default meta
type Story = StoryObj<typeof TableMenu>

export const Default: Story = {
  args: {},
}
