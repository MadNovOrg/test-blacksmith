import type { Meta, StoryObj } from '@storybook/react'

import { FullHeightPageLayout } from './FullHeightPageLayout'

import '@app/i18n/config'

export default {
  title: 'layouts/FullHeightPageLayout',
  component: FullHeightPageLayout,
  decorators: [],
} as Meta<typeof FullHeightPageLayout>

type Story = StoryObj<typeof FullHeightPageLayout>

export const Default: Story = {
  args: {},
}
