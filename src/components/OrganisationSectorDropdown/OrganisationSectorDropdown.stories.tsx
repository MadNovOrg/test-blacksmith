import { Box } from '@mui/material'
import { StoryFn } from '@storybook/react'
import React from 'react'

import { OrganisationSectorDropdown, Props } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/NumericTextField',
  component: OrganisationSectorDropdown,
  decorators: [withMuiThemeProvider],
}
const Template: StoryFn<Props> = args => (
  <Box bgcolor="#ececec" px={5} py={1}>
    <OrganisationSectorDropdown {...args} />
  </Box>
)

export const Default = Template.bind({})
Default.args = {
  value: 'TEST',
  error: '',
  label: 'Sector',
  required: false,
}
