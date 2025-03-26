import { Meta } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { ErrorPage } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/ErrorPage',
  component: ErrorPage,
  decorators: [withMuiThemeProvider],
} as Meta<typeof ErrorPage>

export const Default = () => (
  <MemoryRouter>
    <ErrorPage debug={false} />
  </MemoryRouter>
)
