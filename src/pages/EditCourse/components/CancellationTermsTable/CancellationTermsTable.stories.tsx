import { Meta, StoryObj } from '@storybook/react'

import { CancellationTermsTable } from './'

export default {
  title: 'components/EditCourse/CancellationTermsTable',
  component: CancellationTermsTable,
} as Meta<typeof CancellationTermsTable>

type Story = StoryObj<typeof CancellationTermsTable>

export const Default: Story = {
  args: {
    courseStartDate: new Date(),
  },
}
