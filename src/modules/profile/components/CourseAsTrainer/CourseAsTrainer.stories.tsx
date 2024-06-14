import type { Meta, StoryObj } from '@storybook/react'

import { CourseAsTrainer } from './CourseAsTrainer'

const meta: Meta<typeof CourseAsTrainer> = {
  title: 'pages/common/profile/components/CourseAsTrainer',
  component: CourseAsTrainer,
}

export default meta
type Story = StoryObj<typeof CourseAsTrainer>

export const Default: Story = {
  args: {},
}
