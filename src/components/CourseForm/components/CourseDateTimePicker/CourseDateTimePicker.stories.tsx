import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { StoryFn } from '@storybook/react'
import React from 'react'

import { CourseDateTimePicker, CourseDateTimePickerProps } from './'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/CourseDateTimePicker',
  component: CourseDateTimePicker,
  decorators: [withMuiThemeProvider],
  argTypes: {
    onChange: { action: 'Date or time changed' },
    dateValue: {
      control: 'date',
    },
  },
}
const Template: StoryFn<CourseDateTimePickerProps> = args => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <CourseDateTimePicker {...args} />
  </LocalizationProvider>
)

export const Default = Template.bind({})
Default.args = {
  dateValue: new Date(),
  timeValue: '08:00',
  dateLabel: 'Date',
  timeLabel: 'Time',
  timeId: 'start',
}
