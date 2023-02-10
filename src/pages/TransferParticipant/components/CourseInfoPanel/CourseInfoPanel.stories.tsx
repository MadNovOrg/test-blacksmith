import { Box } from '@mui/material'
import { StoryFn } from '@storybook/react'
import { Chance } from 'chance'
import { addHours } from 'date-fns/esm'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { CourseLevel } from '@app/generated/graphql'

import { CourseInfoPanel, CourseInfoPanelProps } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

import '@app/i18n/config'

export default {
  title: 'pages/TransferParticipant/CourseInfoPanel',
  component: CourseInfoPanel,
  decorators: [withMuiThemeProvider],
}

const Template: StoryFn<CourseInfoPanelProps> = args => (
  <MemoryRouter>
    <Box width={600} bgcolor="grey.200" p={4}>
      <CourseInfoPanel {...args} />
    </Box>
  </MemoryRouter>
)

export const Default = Template.bind({})

const chance = new Chance()
Default.args = {
  course: {
    id: 10030,
    courseCode: 'OP.L1.10000',
    level: CourseLevel.Level_1,
    startDate: new Date(),
    endDate: addHours(new Date(), 8),
    venue: [
      chance.name(),
      chance.address(),
      chance.address(),
      chance.city(),
      chance.postcode(),
    ].join(', '),
  },
}
