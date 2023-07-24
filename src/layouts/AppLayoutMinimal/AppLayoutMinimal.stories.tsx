import type { Meta, StoryObj } from '@storybook/react'

import { AppLayoutMinimal } from './AppLayoutMinimal'

import '@app/i18n/config'

export default {
  title: 'layouts/AppLayoutMinimal',
  component: AppLayoutMinimal,
  decorators: [],
} as Meta<typeof AppLayoutMinimal>

type Story = StoryObj<typeof AppLayoutMinimal>

export const Default: Story = {
  args: {},
}
