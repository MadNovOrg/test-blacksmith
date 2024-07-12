import type { Meta, StoryObj } from '@storybook/react'

import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { Title } from './Title'

import '@app/i18n/config'

const fakeCourse = buildCourse()
const fakeParticipant = buildParticipant()

export default {
  title: 'components/CancelAttendeeDialog/Title',
  component: Title,
  decorators: [],
} as Meta<typeof Title>

type Story = StoryObj<typeof Title>

export const Default: Story = {
  args: {
    fullName: fakeParticipant.profile.fullName,
    courseCode: fakeCourse.course_code,
  },
}
