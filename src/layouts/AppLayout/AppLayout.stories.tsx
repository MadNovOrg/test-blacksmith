import type { Meta, StoryObj } from '@storybook/react'

import { RoleName } from '@app/types'

import { AppLayout } from './AppLayout'

import withAuthContext from '@storybook-decorators/withAuthContext'
import withRouterProvider from '@storybook-decorators/withRouterProvider'

import '@app/i18n/config'

export default {
  title: 'layouts/AppLayout',
  component: AppLayout,
  decorators: [
    withAuthContext({
      activeRole: RoleName.TT_ADMIN,
      acl: {
        canReplaceParticipant: () => true,
      },
    }),
    withRouterProvider,
  ],
} as Meta<typeof AppLayout>

type Story = StoryObj<typeof AppLayout>

export const Default: Story = {
  args: {},
}
