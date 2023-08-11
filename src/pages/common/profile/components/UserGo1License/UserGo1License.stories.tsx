import type { Meta, StoryObj } from '@storybook/react'

import { UserGo1License } from './UserGo1License'

const meta: Meta<typeof UserGo1License> = {
  title: 'pages/common/profile/components/UserGo1License',
  component: UserGo1License,
}

export default meta
type Story = StoryObj<typeof UserGo1License>

export const Default: Story = {
  args: {},
}
