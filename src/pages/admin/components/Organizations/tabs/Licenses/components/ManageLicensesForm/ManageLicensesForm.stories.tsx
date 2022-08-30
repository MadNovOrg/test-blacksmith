import { Box } from '@mui/material'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { ManageLicensesForm } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Go1 Licenses management/ManageLicensesForm',
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof ManageLicensesForm>

export const Default = () => (
  <Box width={500}>
    <ManageLicensesForm currentBalance={200} />
  </Box>
)
