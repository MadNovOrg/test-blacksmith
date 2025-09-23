import type { Meta, StoryObj } from '@storybook/react'

import { RoleName } from '@app/types'

import { AppBar } from './AppBar'

import withAuthContext from '@storybook-decorators/withAuthContext'
import withRouterProvider from '@storybook-decorators/withRouterProvider'

import '@app/i18n/config'

export default {
  title: 'components/AppBar',
  component: AppBar,
  decorators: [
    withAuthContext({
      activeRole: RoleName.TT_ADMIN,
      acl: {
        canReplaceParticipant: () => true,
      },
    }),
    withRouterProvider,
  ],
} as Meta<typeof AppBar>

type Story = StoryObj<typeof AppBar>

export const Default: Story = {
  args: {},
}
