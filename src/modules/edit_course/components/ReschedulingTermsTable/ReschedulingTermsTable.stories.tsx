import { Meta, StoryObj } from '@storybook/react'

import { Course_Level_Enum } from '@app/generated/graphql'

import { ReschedulingTermsTable } from '.'

export default {
  title: 'components/EditCourse/ReschedulingTermsTable',
  component: ReschedulingTermsTable,
} as Meta<typeof ReschedulingTermsTable>

type Story = StoryObj<typeof ReschedulingTermsTable>

export const Default: Story = {
  args: {
    startDate: new Date(),
    level: Course_Level_Enum.Advanced,
  },
}
