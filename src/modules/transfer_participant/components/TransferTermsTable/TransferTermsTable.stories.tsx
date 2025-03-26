import Box from '@mui/material/Box'
import { Meta, StoryFn } from '@storybook/react'
import { addDays } from 'date-fns/esm'
import React from 'react'

import { TransferTermsTable } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'pages/TransferParticipant/TransferTermsTable',
  component: TransferTermsTable,
  decorators: [withMuiThemeProvider],
} as Meta<typeof TransferTermsTable>

const Template: StoryFn<typeof TransferTermsTable> = args => (
  <Box width={400}>
    <TransferTermsTable {...args} />
  </Box>
)

export const LessThanTwoWeeks = Template.bind({})
LessThanTwoWeeks.args = {
  startDate: addDays(new Date(), 5),
}

export const TwoToFourWeeks = Template.bind({})
TwoToFourWeeks.args = {
  startDate: addDays(new Date(), 15),
}

export const FourWeeksPlus = Template.bind({})
FourWeeksPlus.args = {
  startDate: addDays(new Date(), 30),
}
