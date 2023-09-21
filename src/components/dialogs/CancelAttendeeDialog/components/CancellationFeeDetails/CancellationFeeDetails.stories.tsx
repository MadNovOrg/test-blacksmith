import type { Meta, StoryObj } from '@storybook/react'
import { noop } from 'ts-essentials'

import {
  CancellationFeeDetails,
  CancellationFeeType,
} from './CancellationFeeDetails'

import '@app/i18n/config'

export default {
  title: 'components/CancelAttendeeDialog/CancellationFeeDetails',
  component: CancellationFeeDetails,
  decorators: [],
} as Meta<typeof CancellationFeeDetails>

type Story = StoryObj<typeof CancellationFeeDetails>

export const Default: Story = {
  args: {
    feeType: CancellationFeeType.APPLY_CANCELLATION_TERMS,
    errors: {},
    showEditFeePercent: true,
    register: noop as never,
  },
}
