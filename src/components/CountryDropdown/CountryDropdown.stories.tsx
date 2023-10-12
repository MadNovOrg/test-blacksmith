// TODO: @Ionel to improve this as needed
import type { Meta, StoryObj } from '@storybook/react'

import { CountryDropdown } from './CountryDropdown'

import '@app/i18n/config'

export default {
  title: 'components/CancelAttendeeDialog/Title',
  component: CountryDropdown,
  decorators: [],
} as Meta<typeof CountryDropdown>

type Story = StoryObj<typeof CountryDropdown>

export const Default: Story = {
  args: {},
}
