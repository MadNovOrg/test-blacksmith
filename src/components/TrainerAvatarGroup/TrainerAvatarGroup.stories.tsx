import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { buildCourseAssistant, buildCourseLeader } from '@test/mock-data-utils'

import { TrainerAvatarGroup } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'TrainerAvatarGroup',
  component: TrainerAvatarGroup,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof TrainerAvatarGroup>

const Template: ComponentStory<typeof TrainerAvatarGroup> = args => (
  <TrainerAvatarGroup {...args} />
)

export const WithOnlyLead = Template.bind({})
WithOnlyLead.args = {
  trainers: [buildCourseLeader()],
}

export const WithMultipleAssists = Template.bind({})
WithMultipleAssists.args = {
  trainers: [
    buildCourseAssistant(),
    buildCourseLeader(),
    buildCourseAssistant(),
  ],
}
