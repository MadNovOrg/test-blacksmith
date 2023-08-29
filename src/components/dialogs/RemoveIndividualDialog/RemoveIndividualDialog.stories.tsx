import { Button } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { RoleName } from '@app/types'

import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { RemoveIndividualDialog } from './RemoveIndividualDialog'

import withAuthContext from '@storybook-decorators/withAuthContext'

import '@app/i18n/config'

export default {
  title: 'components/dialogs/RemoveIndividualDialog',
  component: RemoveIndividualDialog,
  decorators: [withAuthContext({ activeRole: RoleName.USER })],
} as Meta<typeof RemoveIndividualDialog>

type Story = StoryObj<typeof RemoveIndividualDialog>

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

        {isOpen ? <RemoveIndividualDialog {...args} onClose={toggle} /> : null}
      </>
    )
  },
}
