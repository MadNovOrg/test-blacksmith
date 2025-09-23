import type { Meta, StoryObj } from '@storybook/react'

import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { buildCertificate } from '@test/mock-data-utils'

import { CertificationsTable } from './CertificationsTable'

const meta: Meta<typeof CertificationsTable> = {
  title: 'pages/common/profile/components/CertificationsTable',
  component: CertificationsTable,
}
const certifications = [
  buildCertificate(),
] as GetProfileDetailsQuery['certificates']
export default meta
type Story = StoryObj<typeof CertificationsTable>

export const Default: Story = {
  args: {
    certifications,
  },
}
