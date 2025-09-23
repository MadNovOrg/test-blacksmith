import { Button, Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { Dialog } from './Dialog'

import '@app/i18n/config'

const TitleSlot = () => <Typography variant="h3">A generic title</Typography>

const SubtitleSlot = () => <Typography>A generic subtitle</Typography>

const ContentSlot = () => (
  <Typography>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo officia iusto
    rerum dolorem alias ab a, veritatis facere repellendus nesciunt blanditiis
    praesentium delectus magnam harum cum tempora, voluptatum, provident
    officiis.
  </Typography>
)

const ActionsSlot = () => (
  <>
    <Button>Close</Button>
    <Button>Submit</Button>
  </>
)

export default {
  title: 'components/dialogs/Dialog',
  component: Dialog,
  decorators: [],
} as Meta<typeof Dialog>

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    open: true,
    slots: {
      Title: () => <TitleSlot />,
      Subtitle: () => <SubtitleSlot />,
      Content: () => <ContentSlot />,
      Actions: () => <ActionsSlot />,
    },
  },
}
