import { ComponentMeta, ComponentStory } from '@storybook/react'
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
      oldValue: '9 Sep 2022 9:00 AM - 11 Sep 2022 5:00 PM',
      newValue: '8 Oct 2022 9:00 AM - 14 Oct 2022 5:00 PM',
    },
  ],
}
