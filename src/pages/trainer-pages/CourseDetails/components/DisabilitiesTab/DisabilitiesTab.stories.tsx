import type { Meta, StoryObj } from '@storybook/react'

import { DisabilitiesTab } from '.'

export default {
  title: 'CourseDetails/components/DisabilitiesTab',
  component: DisabilitiesTab,
} as Meta<typeof DisabilitiesTab>

type Story = StoryObj<typeof DisabilitiesTab>

export const Default: Story = {
  args: {
    courseId: 10011,
  },
}
