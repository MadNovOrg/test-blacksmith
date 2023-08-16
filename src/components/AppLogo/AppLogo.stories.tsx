import type { Meta, StoryObj } from '@storybook/react'

import { AppLogo } from '.'

export default {
  title: 'components/AppLogo',
  component: AppLogo,
  decorators: [],
} as Meta<typeof AppLogo>

type Story = StoryObj<typeof AppLogo>
type AppLogoVariants = 'partial' | 'full' | 'white'

export const Default: Story = {
  args: {
    width: 40,
    height: 40,
    variant: 'partial' as AppLogoVariants,
  },
}
