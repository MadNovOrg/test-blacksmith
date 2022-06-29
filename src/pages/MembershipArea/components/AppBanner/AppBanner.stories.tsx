import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { AppBanner } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'Membership/AppBanner',
  component: AppBanner,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof AppBanner>

export const Default = () => <AppBanner />
