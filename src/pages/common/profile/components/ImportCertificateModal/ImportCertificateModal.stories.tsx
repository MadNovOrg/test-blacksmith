import type { Meta, StoryObj } from '@storybook/react'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  ImportLegacyCertificateError,
  ImportLegacyCertificateMutation,
} from '@app/generated/graphql'

import { ImportCertificateModal } from './ImportCertificateModal'

import withi18nProvider from '@storybook-decorators/withi18nProvider'

const meta: Meta<typeof ImportCertificateModal> = {
  title: 'pages/common/profile/ImportCertificateModal',
  component: ImportCertificateModal,
  decorators: [withi18nProvider],
}

export default meta
type Story = StoryObj<typeof ImportCertificateModal>

export const Default: Story = {
  args: { open: true },
  decorators: [
    story => {
      const client = {
        executeMutation: () => never,
      } as unknown as Client

      return <Provider value={client}>{story()}</Provider>
    },
  ],
}

export const AlreadyImportedCertificate: Story = {
  args: { open: true },
  decorators: [
    story => {
      const client = {
        executeMutation: () =>
          fromValue<{ data: ImportLegacyCertificateMutation }>({
            data: {
              importLegacyCertificate: {
                success: false,
                error: ImportLegacyCertificateError.AlreadyImported,
              },
            },
          }),
      } as unknown as Client

      return <Provider value={client}>{story()}</Provider>
    },
  ],
}
