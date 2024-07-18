import { Meta, StoryObj } from '@storybook/react'

import { CourseDiffTable } from '.'

export default {
  title: 'components/EditCourse/CourseDiffTable',
  component: CourseDiffTable,
} as Meta<typeof CourseDiffTable>

type Story = StoryObj<typeof CourseDiffTable>

export const Default: Story = {
  args: {
    diff: [
      {
        type: 'date',
        newValue: Array.from({ length: 2 }, () => new Date()),
        oldValue: Array.from({ length: 2 }, () => new Date()),
      },
    ],
  },
}
