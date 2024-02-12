import { Meta, StoryObj } from '@storybook/react'

import { GetCertificationsQuery } from '@app/generated/graphql'

import { buildCertificate } from '@test/mock-data-utils'

import { CertificationsTable } from './CertificationsTable'

import withi18nProvider from '@storybook-decorators/withi18nProvider'
import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'modules/certifications/components/CertificationsTable',
  component: CertificationsTable,
  decorators: [withMuiThemeProvider, withi18nProvider],
} as Meta<typeof CertificationsTable>

type Story = StoryObj<typeof CertificationsTable>

const certificates = [
  buildCertificate(),
] as GetCertificationsQuery['certifications']

export const Default: Story = {
  args: {
    certificates,
    filtered: false,
  },
}
