import type { Meta, StoryObj } from '@storybook/react'

import { RoleName } from '@app/types'

import { buildParticipant } from '@test/mock-data-utils'

import { CourseActionsMenu } from './CourseActionsMenu'

import withAuthContext from '@storybook-decorators/withAuthContext'

import '@app/i18n/config'

export default {
  title: 'components/CourseActionsMenu',
  component: CourseActionsMenu,
  decorators: [
    withAuthContext({
      activeRole: RoleName.TT_ADMIN,
      acl: {
        canReplaceParticipant: () => true,
      },
    }),
  ],
} as Meta<typeof CourseActionsMenu>

type Story = StoryObj<typeof CourseActionsMenu>

export const Default: Story = {
  args: {
    item: buildParticipant(),
    onRemoveClick: () => true,
  },
}
