import { Meta, StoryObj } from '@storybook/react'

import { buildRole } from '@test/mock-data-utils'

import { FilterAccordion } from './index'

export default {
  title: 'components/filters/FilterAccordion',
  component: FilterAccordion,
} as Meta<typeof FilterAccordion>

type Story = StoryObj<typeof FilterAccordion>

export const Default: Story = {
  args: {
    title: 'role',
    options: [buildRole(), buildRole(), buildRole()].map(r => ({
      id: r.id,
      title: r.name,
      selected: false,
    })),
  },
}
