import type { Meta, StoryObj } from '@storybook/react'
import { noop } from 'ts-essentials'

import { CancellationFeeType } from '@app/generated/graphql'

import { CancellationFeeDetails } from './CancellationFeeDetails'

import '@app/i18n/config'

export default {
  title: 'components/CancelAttendeeDialog/CancellationFeeDetails',
  component: CancellationFeeDetails,
  decorators: [],
} as Meta<typeof CancellationFeeDetails>

type Story = StoryObj<typeof CancellationFeeDetails>

export const Default: Story = {
  args: {
    feeType: CancellationFeeType.ApplyCancellationTerms,
    errors: {},
    showEditFeePercent: true,
    register: noop as never,
  },
}
