import { Meta } from '@storybook/react'
import React from 'react'

import { AppBanner } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Membership/AppBanner',
  component: AppBanner,
  decorators: [withMuiThemeProvider],
} as Meta<typeof AppBanner>

export const Default = () => <AppBanner />
