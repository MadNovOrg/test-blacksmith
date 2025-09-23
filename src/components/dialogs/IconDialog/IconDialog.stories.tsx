import EditIcon from '@mui/icons-material/Edit'
import type { Meta, StoryObj } from '@storybook/react'

import { IconDialog } from './IconDialog'

import '@app/i18n/config'

export default {
  title: 'components/dialogs/IconDialog',
  component: IconDialog,
  decorators: [],
} as Meta<typeof IconDialog>

type Story = StoryObj<typeof IconDialog>

export const Default: Story = {
  args: {
    icon: <EditIcon />,
    children: <div> This is a dialog!</div>,
  },
}
