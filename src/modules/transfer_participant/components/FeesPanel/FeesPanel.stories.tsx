import { Box } from '@mui/material'
import { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import { TransferModeEnum } from '../TransferParticipantProvider'

import FeesPanel from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'pages/TransferParticipant/FeesPanel',
  component: FeesPanel,
  argTypes: { onChange: { action: 'form values changed' } },
  decorators: [withMuiThemeProvider],
} as Meta<typeof FeesPanel>

const Template: StoryFn<typeof FeesPanel> = args => (
  <Box width={600} bgcolor="grey.200" p={4}>
    <FeesPanel {...args} />
  </Box>
)

export const Default = Template.bind({})

export const AsOrgAdmin = Template.bind({})
AsOrgAdmin.args = {
  mode: TransferModeEnum.ORG_ADMIN_TRANSFERS,
}
