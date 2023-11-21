import type { Meta, StoryObj } from '@storybook/react'

import { DietaryRequirementsTab } from '.'

export default {
  title: 'CourseDetails/components/DietaryRequirementsTab',
  component: DietaryRequirementsTab,
} as Meta<typeof DietaryRequirementsTab>

type Story = StoryObj<typeof DietaryRequirementsTab>

export const Default: Story = {
  args: {
    courseId: 10011,
  },
}
