import { Meta, StoryObj } from '@storybook/react'

import { buildCourse } from '@test/mock-data-utils'

import { CourseCancellationModal } from '.'

export default {
  title: 'components/EditCourse/CourseCancellationModal',
  component: CourseCancellationModal,
} as Meta<typeof CourseCancellationModal>

type Story = StoryObj<typeof CourseCancellationModal>

export const Default: Story = {
  args: {
    course: buildCourse(),
    onClose: () => null,
    onSubmit: () => null,
  },
}
