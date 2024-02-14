import { Meta, StoryObj } from '@storybook/react'

import { OrgMembersQuery } from '@app/generated/graphql'

import { chance } from '@test/index'

import { EditOrgUserModal } from './EditOrgUserModal'

import withi18nProvider from '@storybook-decorators/withi18nProvider'
import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'modules/organisation/components/CertificationsTable',
  component: EditOrgUserModal,
  decorators: [withMuiThemeProvider, withi18nProvider],
} as Meta<typeof EditOrgUserModal>

type Story = StoryObj<typeof EditOrgUserModal>

export const Default: Story = {
  args: {
    orgMember: {} as OrgMembersQuery['members'][0],
    onClose: () => null,
    onChange: () => null,
    orgId: chance.guid(),
  },
}
