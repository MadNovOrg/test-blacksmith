import type { Meta, StoryObj } from '@storybook/react'

import { UnverifiedLayout } from './UnverifiedLayout'

import '@app/i18n/config'

export default {
  title: 'layouts/UnverifiedLayout',
  component: UnverifiedLayout,
  decorators: [],
} as Meta<typeof UnverifiedLayout>

type Story = StoryObj<typeof UnverifiedLayout>

export const Default: Story = {
  args: {},
}
