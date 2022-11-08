import { ComponentMeta, ComponentStory } from '@storybook/react'
import { addHours } from 'date-fns'
import React from 'react'

import { RoleName } from '@app/types'

import { ReviewChangesModal } from '.'

import withAuthContext from '@storybook-decorators/withAuthContext'
import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Pages/EditCourse/ReviewChangesModal',
  component: ReviewChangesModal,
  decorators: [withMuiThemeProvider],
  argTypes: {
    onCancel: { action: 'cancelled' },
    onConfirm: { action: 'confirmed' },
  },
} as ComponentMeta<typeof ReviewChangesModal>

const Template: ComponentStory<typeof ReviewChangesModal> = args => (
  <ReviewChangesModal {...args} />
)

export const DateChanged = Template.bind({})
DateChanged.args = {
  open: true,
  diff: [
    {
      type: 'date',
      oldValue: [new Date(), addHours(new Date(), 5)],
      newValue: [new Date(), addHours(new Date(), 8)],
    },
  ],
}
DateChanged.decorators = [withAuthContext({ activeRole: RoleName.TT_ADMIN })]

export const WithFees = Template.bind({})
WithFees.args = {
  open: true,
  withFees: true,
  diff: [
    {
      type: 'date',
      oldValue: [new Date(), addHours(new Date(), 5)],
      newValue: [new Date(), addHours(new Date(), 8)],
    },
  ],
}
WithFees.decorators = [withAuthContext({ activeRole: RoleName.TT_ADMIN })]

export const NotAlignedWithProtocol = Template.bind({})
NotAlignedWithProtocol.args = {
  open: true,
  withFees: true,
  alignedWithProtocol: false,
  diff: [
    {
      type: 'date',
      oldValue: [new Date(), addHours(new Date(), 5)],
      newValue: [new Date(), addHours(new Date(), 8)],
    },
  ],
}
NotAlignedWithProtocol.decorators = [
  withAuthContext({ activeRole: RoleName.TRAINER }),
]

export const SalesNotAlignedWithProtocol = Template.bind({})
SalesNotAlignedWithProtocol.args = {
  open: true,
  withFees: true,
  alignedWithProtocol: false,
  diff: [
    {
      type: 'date',
      oldValue: [new Date(), addHours(new Date(), 5)],
      newValue: [new Date(), addHours(new Date(), 8)],
    },
  ],
}
SalesNotAlignedWithProtocol.decorators = [
  withAuthContext({ activeRole: RoleName.SALES_ADMIN }),
]
