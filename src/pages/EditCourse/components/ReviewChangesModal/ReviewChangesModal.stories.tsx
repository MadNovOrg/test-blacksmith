import { ComponentMeta, ComponentStory } from '@storybook/react'
import { addHours } from 'date-fns'
import React from 'react'

import { ReviewChangesModal } from '.'

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
