import { Box } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import theme from '@app/theme'

import { ResourceItemCard, Props } from './ResourceItemCard'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Resources/ResourceItemCard',
  component: ResourceItemCard,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof ResourceItemCard>

const props: Props = {
  resource: {
    id: '1',
    title: '2015 Children Homes Standards Summary',
    resourceType: {
      resourcetype: 'pdf',
    },
    downloads: {
      file: {
        mediaItemUrl: 'https://dummy-url',
      },
    },
  },
}

const Template: ComponentStory<typeof ResourceItemCard> = args => (
  <Box
    bgcolor={theme.palette.grey[100]}
    display="flex"
    justifyContent="center"
    height="100vh"
    sx={{ pt: 5 }}
  >
    <Box width={600}>
      <ResourceItemCard {...args} />
    </Box>
  </Box>
)

export const Default = Template.bind({})
Default.args = {
  ...props,
}
