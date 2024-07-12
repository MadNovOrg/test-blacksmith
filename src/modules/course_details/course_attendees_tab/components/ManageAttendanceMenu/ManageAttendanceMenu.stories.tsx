import type { Meta, StoryObj } from '@storybook/react'

import { RoleName } from '@app/types'

import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { ManageAttendanceMenu } from './ManageAttendanceMenu'

import withAuthContext from '@storybook-decorators/withAuthContext'

import '@app/i18n/config'

export default {
  title: 'components/ManageAttendanceMenu',
  component: ManageAttendanceMenu,
  decorators: [
    withAuthContext({
      activeRole: RoleName.TT_ADMIN,
      acl: {
        canReplaceParticipant: () => true,
      },
    }),
  ],
} as Meta<typeof ManageAttendanceMenu>

type Story = StoryObj<typeof ManageAttendanceMenu>

export const Default: Story = {
  args: {
    course: buildCourse(),
    courseParticipant: buildParticipant(),
    onCancelClick: () => true,
  },
}
