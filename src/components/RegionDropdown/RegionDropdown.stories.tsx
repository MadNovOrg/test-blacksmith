// TODO: @Ion to improve this as needed
import type { Meta, StoryObj } from '@storybook/react'

import { RegionDropdown } from './RegionDropdown'

import '@app/i18n/config'

export default {
  title: 'components/CancelAttendeeDialog/Title',
  component: RegionDropdown,
  decorators: [],
} as Meta<typeof RegionDropdown>

type Story = StoryObj<typeof RegionDropdown>

export const Default: Story = {
  args: {},
}
