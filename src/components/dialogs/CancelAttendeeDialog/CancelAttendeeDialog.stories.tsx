import { Button } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { RoleName } from '@app/types'

import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { CancelAttendeeDialog } from './CancelAttendeeDialog'

import withAuthContext from '@storybook-decorators/withAuthContext'

import '@app/i18n/config'

export default {
  title: 'components/dialogs/CancelAttendeeDialog',
  component: CancelAttendeeDialog,
  decorators: [withAuthContext({ activeRole: RoleName.USER })],
} as Meta<typeof CancelAttendeeDialog>

type Story = StoryObj<typeof CancelAttendeeDialog>

export const Default: Story = {
  args: {
    course: buildCourse({}),
    participant: buildParticipant({}),
  },
  render: function Component(args) {
    const [isOpen, toggleDialog] = useState(false)
    const toggle = () => {
      toggleDialog(!isOpen)
    }

    return (
      <>
        <Button onClick={toggle}>Open dialog</Button>

        {isOpen ? <CancelAttendeeDialog {...args} onClose={toggle} /> : null}
      </>
    )
  },
}

export const Minimal: Story = {
  args: {
    ...Default.args,
    variant: 'minimal',
  },
}

export const Complete: Story = {
  args: {
    ...Default.args,
    variant: 'complete',
  },
}
