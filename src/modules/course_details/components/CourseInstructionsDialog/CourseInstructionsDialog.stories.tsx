import { Button } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { CourseInstructionsDialog } from './CourseInstructionsDialog'

import '@app/i18n/config'

export default {
  title: 'components/dialogs/CourseInstructionsDialog',
  component: CourseInstructionsDialog,
  decorators: [],
} as Meta<typeof CourseInstructionsDialog>

type Story = StoryObj<typeof CourseInstructionsDialog>

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

        <CourseInstructionsDialog {...args} open={isOpen} onCancel={toggle} />
      </>
    )
  },
}
