import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { BrowseByMedia } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Membership/BrowseByMedia',
  component: BrowseByMedia,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof BrowseByMedia>

export const Default = () => (
  <MemoryRouter>
    <BrowseByMedia />
  </MemoryRouter>
)
