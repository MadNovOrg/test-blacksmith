import { Box } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Chance } from 'chance'
import { addHours } from 'date-fns/esm'
import React from 'react'

import { Course_Level_Enum } from '@app/generated/graphql'

import { CourseInfoPanel } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'pages/TransferParticipant/CourseInfoPanel',
  component: CourseInfoPanel,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof CourseInfoPanel>

const chance = new Chance()

const Template: ComponentStory<typeof CourseInfoPanel> = args => (
  <Box width={600} bgcolor="grey.200" p={4}>
    <CourseInfoPanel {...args} />
  </Box>
)

export const Default = Template.bind({})
Default.args = {
  course: {
    level: Course_Level_Enum.Level_1,
    startDate: new Date().toISOString(),
    endDate: addHours(new Date(), 8).toISOString(),
    venue: {
      name: chance.name(),
      addressLineOne: chance.address(),
      addressLineTwo: chance.address(),
      city: chance.city(),
      postCode: chance.postcode(),
    },
  },
}
