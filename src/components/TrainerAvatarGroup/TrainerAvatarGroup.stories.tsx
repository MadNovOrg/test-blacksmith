import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import {
  Course_Invite_Status_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'

import { TrainerAvatarGroup } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/TrainerAvatarGroup',
  component: TrainerAvatarGroup,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof TrainerAvatarGroup>

const Template: ComponentStory<typeof TrainerAvatarGroup> = args => (
  <TrainerAvatarGroup {...args} />
)

export const WithOnlyLead = Template.bind({})
WithOnlyLead.args = {
  trainers: [
    {
      id: '1',
      type: Course_Trainer_Type_Enum.Leader,
      status: Course_Invite_Status_Enum.Accepted,
      profile: { fullName: 'John Doe' },
    },
  ],
}

export const WithMultipleAssists = Template.bind({})
WithMultipleAssists.args = {
  trainers: [
    {
      id: '1',
      type: Course_Trainer_Type_Enum.Assistant,
      status: Course_Invite_Status_Enum.Accepted,
      profile: { fullName: 'John Doe' },
    },
    {
      id: '2',
      type: Course_Trainer_Type_Enum.Leader,
      status: Course_Invite_Status_Enum.Accepted,
      profile: { fullName: 'Mark Doe' },
    },
    {
      id: '3',
      type: Course_Trainer_Type_Enum.Assistant,
      status: Course_Invite_Status_Enum.Pending,
      profile: { fullName: 'John Doe' },
    },
  ],
}
