import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { CourseAttendanceList } from './index'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'pages/CourseGradingDetails/CourseAttendanceList',
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof CourseAttendanceList>

const Template: ComponentStory<typeof CourseAttendanceList> = args => (
  <CourseAttendanceList {...args} />
)

export const Default = Template.bind({})
Default.args = {
  participants: [
    { name: 'Alonzo Hauck', attending: true, id: 'Alonzo Hauck' },
    { name: 'Andy Miller', attending: false, id: 'Andy Miller' },
  ],
}
