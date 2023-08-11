import type { Meta, StoryObj } from '@storybook/react'

import { ImportCertificateModal } from './ImportCertificateModal'

const meta: Meta<typeof ImportCertificateModal> = {
  title: 'pages/common/profile/ImportCertificateModal',
  component: ImportCertificateModal,
}

export default meta
type Story = StoryObj<typeof ImportCertificateModal>

export const Default: Story = {
  args: {},
}
