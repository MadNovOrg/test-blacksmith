import { Meta, StoryFn } from '@storybook/react'
import { addHours } from 'date-fns'

import { Course_Level_Enum } from '@app/generated/graphql'
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
} as Meta<typeof ReviewChangesModal>

const Template: StoryFn<typeof ReviewChangesModal> = args => (
  <ReviewChangesModal {...args} />
)

export const DateChanged = Template.bind({})
DateChanged.args = {
  open: true,
  level: Course_Level_Enum.Level_1,
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
  level: Course_Level_Enum.Level_1,
  diff: [
    {
      type: 'date',
      oldValue: [new Date(), addHours(new Date(), 5)],
      newValue: [new Date(), addHours(new Date(), 8)],
    },
  ],
}
WithFees.decorators = [withAuthContext({ activeRole: RoleName.TT_ADMIN })]

export const WithFeesForTrainerCourses = Template.bind({})
WithFees.args = {
  open: true,
  withFees: true,
  level: Course_Level_Enum.AdvancedTrainer,
  diff: [
    {
      type: 'date',
      oldValue: [new Date(), addHours(new Date(), 5)],
      newValue: [new Date(), addHours(new Date(), 8)],
    },
  ],
}
WithFeesForTrainerCourses.decorators = [
  withAuthContext({ activeRole: RoleName.TT_ADMIN }),
]

export const NotAlignedWithProtocol = Template.bind({})
NotAlignedWithProtocol.args = {
  open: true,
  level: Course_Level_Enum.Level_1,
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
  level: Course_Level_Enum.Level_1,
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
