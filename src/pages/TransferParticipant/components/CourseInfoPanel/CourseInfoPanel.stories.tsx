import { Box } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Chance } from 'chance'
import { addHours } from 'date-fns/esm'
import React from 'react'

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
    courseCode: 'OP.L1.10000',
    startDate: new Date().toISOString(),
    endDate: addHours(new Date(), 8).toISOString(),
    venue: [
      chance.name(),
      chance.address(),
      chance.address(),
      chance.city(),
      chance.postcode(),
    ].join(', '),
  },
}
