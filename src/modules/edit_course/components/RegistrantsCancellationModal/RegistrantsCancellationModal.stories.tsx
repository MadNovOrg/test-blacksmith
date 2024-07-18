import { Meta, StoryObj } from '@storybook/react'

import { RegistrantsCancellationModal } from '.'

export default {
  title: 'components/EditCourse/RegistrantsCancellationModal',
  component: RegistrantsCancellationModal,
} as Meta<typeof RegistrantsCancellationModal>

type Story = StoryObj<typeof RegistrantsCancellationModal>

export const Default: Story = {
  args: {
    onProceed: () => null,
    onTransfer: () => null,
  },
}
