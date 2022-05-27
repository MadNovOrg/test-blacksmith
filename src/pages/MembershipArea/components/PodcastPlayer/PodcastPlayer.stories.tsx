import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { PodcastPlayer } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Membership/PodcastPlayer',
  component: PodcastPlayer,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof PodcastPlayer>

const Template: ComponentStory<typeof PodcastPlayer> = args => (
  <PodcastPlayer {...args} />
)

export const Default = Template.bind({})
Default.args = {
  thumbnailUrl:
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869',
  title: 'Episode #1',
  author: 'The Team Teach Podcast',
  mediaUrl:
    'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2022-4-11/9e2fa316-c0a9-fa23-e2b1-9e3f6fb8e0d2.mp3',
}
