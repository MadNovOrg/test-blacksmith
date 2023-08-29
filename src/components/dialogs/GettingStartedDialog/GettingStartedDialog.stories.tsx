import { Button } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { GettingStartedDialog } from './GettingStartedDialog'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

import '@app/i18n/config'

export default {
  title: 'components/dialogs/GettingStartedDialog',
  component: GettingStartedDialog,
  decorators: [withRouterProvider],
} as Meta<typeof GettingStartedDialog>

type Story = StoryObj<typeof GettingStartedDialog>

export const Default: Story = {
  args: {
    options: [
      {
        id: '0',
        title: 'This is a title',
        description: 'This is a description',
        image: '#',
        video: '#',
      },
    ],
  },
  render: function Component(args) {
    const [isOpen, toggleDialog] = useState(false)
    const toggle = () => {
      toggleDialog(!isOpen)
    }

    return (
      <>
        <Button onClick={toggle}>Open dialog</Button>

        <GettingStartedDialog {...args} open={isOpen} onClose={toggle} />
      </>
    )
  },
}
