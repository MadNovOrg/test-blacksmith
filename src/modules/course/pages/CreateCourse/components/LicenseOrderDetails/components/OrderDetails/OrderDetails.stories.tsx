import { Box } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { calculateGo1LicenseCost } from '@app/modules/course/pages/CreateCourse/utils'

import { OrderDetails } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Pages/CreateCourse/OrderDetails',
  component: OrderDetails,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof OrderDetails>

const Template: ComponentStory<typeof OrderDetails> = args => (
  <Box bgcolor="#ececec" p={5}>
    <OrderDetails {...args} />
  </Box>
)

export const FullLicenseAllowance = Template.bind({})
FullLicenseAllowance.args = {
  numberOfLicenses: 2,
  licensesBalance: 4,
  ...calculateGo1LicenseCost({
    numberOfLicenses: 2,
    licenseBalance: 4,
  }),
}

export const PartialLicenseAllowance = Template.bind({})
PartialLicenseAllowance.args = {
  numberOfLicenses: 2,
  licensesBalance: 1,
  ...calculateGo1LicenseCost({
    numberOfLicenses: 2,
    licenseBalance: 1,
  }),
}

export const NoLicenseAllowance = Template.bind({})
NoLicenseAllowance.args = {
  numberOfLicenses: 5,
  licensesBalance: 0,
  ...calculateGo1LicenseCost({
    numberOfLicenses: 5,
    licenseBalance: 0,
  }),
}
