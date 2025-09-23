import type { Meta, StoryObj } from '@storybook/react'

import { Actions } from './Actions'

import '@app/i18n/config'

export default {
  title: 'components/CancelAttendeeDialog/Actions',
  component: Actions,
  decorators: [],
} as Meta<typeof Actions>

type Story = StoryObj<typeof Actions>

export const Default: Story = {
  args: {},
}
