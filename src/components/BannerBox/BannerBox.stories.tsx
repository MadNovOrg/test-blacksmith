import type { Meta, StoryObj } from '@storybook/react'

import { BannerBox } from '.'

export default {
  title: 'components/BannerBox',
  component: BannerBox,
  decorators: [],
} as Meta<typeof BannerBox>

type Story = StoryObj<typeof BannerBox>

export const Default: Story = {
  args: {},
}

export const WithRoundedCorners: Story = {
  args: {
    roundedCorners: true,
  },
}
