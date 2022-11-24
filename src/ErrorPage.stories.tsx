import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { ErrorPage } from './components/ErrorPage'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/ErrorPage',
  component: ErrorPage,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof ErrorPage>

export const Default = () => (
  <MemoryRouter>
    <ErrorPage debug={false} />
  </MemoryRouter>
)
