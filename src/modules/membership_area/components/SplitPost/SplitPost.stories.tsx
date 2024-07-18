import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { SplitPost, Props, SplitPostSkeleton } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Membership/SplitPost',
  component: SplitPost,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof SplitPost>

const props: Props = {
  id: '1',
  title: 'The ultimate guide to lorem ipsum dolor sit amet consectur',
  description:
    'Facilisi cursus ac tincidunt integer nunc ac quis neque. Amet, magna sed mattis aliquam in eu et elit. Purus  tempor eu iaculis.',
  imageUrl:
    'https://images.unsplash.com/photo-1638913665258-ddd2bceafb30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
  label: 'Team Teach recommends',
  category: { id: '1', name: 'Vlogs and blogs' },
  publishedDate: '2020-01-01',
  tags: [
    { id: '1', name: 'Tag name' },
    { id: '2', name: 'Tag name 2' },
  ],
}

const Template: ComponentStory<typeof SplitPost> = args => (
  <MemoryRouter initialEntries={['/']}>
    <div style={{ width: 1000 }}>
      <SplitPost {...args} />
    </div>
  </MemoryRouter>
)

export const LeftOrientation = Template.bind({})
LeftOrientation.args = {
  ...props,
  orientation: 'left',
}

export const RightOrientation = Template.bind({})
RightOrientation.args = {
  ...props,
  orientation: 'right',
}

export const Skeleton = () => <SplitPostSkeleton />
