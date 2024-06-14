import type { Meta, StoryObj } from '@storybook/react'

import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { buildCertificate } from '@test/mock-data-utils'

import { CertificationsAlerts } from './CertificationsAlerts'

const meta: Meta<typeof CertificationsAlerts> = {
  title: 'pages/common/profile/components/CertificationsAlert',
  component: CertificationsAlerts,
}
const certificate =
  buildCertificate() as unknown as GetProfileDetailsQuery['certificates'][0]
export default meta
type Story = StoryObj<typeof CertificationsAlerts>

export const Default: Story = {
  args: {
    certificate,
  },
}
