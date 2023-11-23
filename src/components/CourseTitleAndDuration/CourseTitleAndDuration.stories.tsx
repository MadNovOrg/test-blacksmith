import { Box } from '@mui/material'
import { StoryFn } from '@storybook/react'
import { addHours, addDays } from 'date-fns/esm'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { Course_Level_Enum } from '@app/generated/graphql'

import { CourseTitleAndDuration, CourseTitleAndDurationProps } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

import '@app/i18n/config'

export default {
  title: 'components/CourseTitleAndDuration',
  component: CourseTitleAndDuration,
  decorators: [withMuiThemeProvider],
}

const Template: StoryFn<CourseTitleAndDurationProps> = args => (
  <MemoryRouter>
    <Box width={600} bgcolor="grey.200" p={4}>
      <CourseTitleAndDuration {...args} />
    </Box>
  </MemoryRouter>
)

export const OneDayCourse = Template.bind({})
OneDayCourse.args = {
  showCourseLink: true,
  course: {
    id: 10030,
    course_code: 'OP.L1.10000',
    level: Course_Level_Enum.Level_1,
    start: new Date().toISOString(),
    end: addHours(new Date(), 8).toISOString(),
  },
}

export const TwoDaysCourse = Template.bind({})
TwoDaysCourse.args = {
  showCourseLink: true,
  course: {
    id: 10040,
    course_code: 'OP.L1.10022',
    level: Course_Level_Enum.Level_2,
    start: new Date().toISOString(),
    end: addDays(new Date(), 1).toISOString(),
  },
}
