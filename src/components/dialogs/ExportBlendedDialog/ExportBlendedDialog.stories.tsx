import { Button } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { ExportBlendedDialog } from './ExportBlendedDialog'

import withRouterProvider from '@storybook-decorators/withRouterProvider'

import '@app/i18n/config'

export default {
  title: 'components/dialogs/ExportBlendedDialog',
  component: ExportBlendedDialog,
  decorators: [withRouterProvider],
} as Meta<typeof ExportBlendedDialog>

type Story = StoryObj<typeof ExportBlendedDialog>

export const Default: Story = {
  args: {},
  render: function Component(args) {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => {
      setIsOpen(!isOpen)
    }

    return (
      <>
        <Button onClick={toggle}>Open dialog</Button>

        <ExportBlendedDialog {...args} isOpen={isOpen} closeModal={toggle} />
      </>
    )
  },
}
