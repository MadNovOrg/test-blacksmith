import { Button } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { RoleName } from '@app/types'

import { MergeUsersDialog } from './MergeUsersDialog'

import withAuthContext from '@storybook-decorators/withAuthContext'

import '@app/i18n/config'

export default {
  title: 'components/dialogs/MergeUsersDialog',
  component: MergeUsersDialog,
  decorators: [withAuthContext({ activeRole: RoleName.USER })],
} as Meta<typeof MergeUsersDialog>

type Story = StoryObj<typeof MergeUsersDialog>

export const Default: Story = {
  args: {},
  render: function Component(args) {
    const [isOpen, toggleDialog] = useState(false)
    const toggle = () => {
      toggleDialog(!isOpen)
    }

    return (
      <>
        <Button onClick={toggle}>Open dialog</Button>

        {isOpen ? (
          <MergeUsersDialog
            {...args}
            onClose={toggle}
            profileId1="0"
            profileId2="1"
          />
        ) : null}
      </>
    )
  },
}
