import type { Meta, StoryObj } from '@storybook/react'

import { AppFooter } from '.'

export default {
  title: 'components/AppFooter',
  component: AppFooter,
} as Meta<typeof AppFooter>

type Story = StoryObj<typeof AppFooter>

export const Default: Story = {
  args: {},
}
