import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import theme from '@app/theme'

import { ExternalResourceCard, Props } from './ExternalResourceCard'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Resources/ExternalResourceCard',
  component: ExternalResourceCard,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof ExternalResourceCard>

const props: Props = {
  text: '2015 Children Homes Standards Summary',
  icon: <PictureAsPdfIcon color="success" fontSize="small" />,
}

const Template: ComponentStory<typeof ExternalResourceCard> = args => (
  <Box
    bgcolor={theme.palette.grey[100]}
    display="flex"
    justifyContent="center"
    height="100vh"
    sx={{ pt: 5 }}
  >
    <Box width={600}>
      <ExternalResourceCard {...args} />
    </Box>
  </Box>
)

export const Default = Template.bind({})
Default.args = {
  ...props,
}
