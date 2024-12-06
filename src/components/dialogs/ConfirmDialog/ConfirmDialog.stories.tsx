import { Button, Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { ConfirmDialog } from './ConfirmDialog'

import '@app/i18n/config'

export default {
  title: 'components/dialogs/ConfirmDialog',
  component: ConfirmDialog,
  decorators: [],
} as Meta<typeof ConfirmDialog>

type Story = StoryObj<typeof ConfirmDialog>

export const Default: Story = {
  args: {
    title: <Typography>Here goes the title</Typography>,
    message: <Typography>Here goes the message</Typography>,
  },
  render: function Component(args) {
    const [isOpen, setToggleDialog] = useState(false)
    const toggle = () => {
      setToggleDialog(!isOpen)
    }

    return (
      <>
        <Button onClick={toggle}>Open dialog</Button>

        <ConfirmDialog
          {...args}
          open={isOpen}
          onCancel={toggle}
          onOk={toggle}
        />
      </>
    )
  },
}
