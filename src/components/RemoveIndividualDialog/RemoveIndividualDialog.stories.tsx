import type { Meta, StoryObj } from '@storybook/react'

import { RoleName } from '@app/types'

import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { RemoveIndividualDialog } from './RemoveIndividualDialog'

import withAuthContext from '@storybook-decorators/withAuthContext'

import '@app/i18n/config'

export default {
  title: 'components/RemoveIndividualDialog',
  component: RemoveIndividualDialog,
  decorators: [withAuthContext({ activeRole: RoleName.USER })],
} as Meta<typeof RemoveIndividualDialog>

type Story = StoryObj<typeof RemoveIndividualDialog>

export const Default: Story = {
  args: {
    course: buildCourse({}),
    participant: buildParticipant({}),
  },
}
