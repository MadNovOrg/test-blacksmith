import { Meta, StoryObj } from '@storybook/react'

import { CertificateStatus } from '@app/generated/graphql'

import { chance } from '@test/index'

import { OrgUsersTable } from '.'

import withi18nProvider from '@storybook-decorators/withi18nProvider'
import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'modules/organisation/components/CertificationsTable',
  component: OrgUsersTable,
  decorators: [withMuiThemeProvider, withi18nProvider],
} as Meta<typeof OrgUsersTable>

type Story = StoryObj<typeof OrgUsersTable>

export const Default: Story = {
  args: {
    orgId: chance.guid(),
    onChange: () => null,
    certificateStatus: Object.values(CertificateStatus),
  },
}
