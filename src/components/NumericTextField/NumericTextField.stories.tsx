import { Box } from '@mui/material'
import { StoryFn } from '@storybook/react'
import React from 'react'

import { NumericTextField, NumericTextFieldProps } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/NumericTextField',
  component: NumericTextField,
  decorators: [withMuiThemeProvider],
}
const Template: StoryFn<NumericTextFieldProps> = args => (
  <Box bgcolor="#ececec" px={5} py={1}>
    <NumericTextField {...args} />
  </Box>
)

export const Default = Template.bind({})
Default.args = {
  value: 80,
}
