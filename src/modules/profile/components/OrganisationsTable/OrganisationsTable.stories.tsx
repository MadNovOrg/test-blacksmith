import type { Meta, StoryObj } from '@storybook/react'

import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { buildProfile } from '@test/mock-data-utils'

import { OrganisationsTable } from './OrganisationsTable'

const meta: Meta<typeof OrganisationsTable> = {
  title: 'pages/common/profile/components/OrganisationsTable',
  component: OrganisationsTable,
}
const profile = buildProfile() as unknown as GetProfileDetailsQuery['profile']
export default meta
type Story = StoryObj<typeof OrganisationsTable>

export const Default: Story = {
  args: {
    profile,
  },
}
