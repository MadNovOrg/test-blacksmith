import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined'
import { Box } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import theme from '@app/theme'

import { ResourceCard, Props } from './ResourceCard'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Resources/ResourceCard',
  component: ResourceCard,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof ResourceCard>

const props: Props = {
  title: 'Best practice & templates',
  description:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  icon: <TopicOutlinedIcon />,
}

const Template: ComponentStory<typeof ResourceCard> = args => (
  <Box
    bgcolor={theme.palette.grey[100]}
    display="flex"
    justifyContent="center"
    height="100vh"
    sx={{ pt: 5 }}
  >
    <Box width={400}>
      <ResourceCard {...args} />
    </Box>
  </Box>
)

export const Default = Template.bind({})
Default.args = {
  ...props,
}

export const LeftAlign = Template.bind({})
LeftAlign.args = {
  ...props,
  align: 'left',
}
