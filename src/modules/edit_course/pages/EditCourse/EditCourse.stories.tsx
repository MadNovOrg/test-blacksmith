import { Meta, StoryObj } from '@storybook/react'

import { EditCourse } from '.'

const meta: Meta<typeof EditCourse> = {
  title: 'Pages/EditCourse',
  component: EditCourse,
}

export default meta

type Story = StoryObj<typeof EditCourse>

export const EditCourseStory: Story = {
  args: {},
}
