import type { Meta, StoryObj } from '@storybook/react'

import { CoursesTable } from './CoursesTable'

const meta: Meta<typeof CoursesTable> = {
  title: 'pages/common/profile/components/CoursesTable',
  component: CoursesTable,
}

export default meta
type Story = StoryObj<typeof CoursesTable>

export const Default: Story = {
  args: {},
}
