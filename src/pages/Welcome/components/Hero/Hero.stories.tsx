import { Meta, StoryObj } from '@storybook/react'

import { Course_Level_Enum } from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

import { Hero } from './Hero'

import withAuthContext from '@storybook-decorators/withAuthContext'
import withi18nProvider from '@storybook-decorators/withi18nProvider'
import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'
import withRouterProvider from '@storybook-decorators/withRouterProvider'

export default {
  title: 'pages/Welcome/Hero',
  component: Hero,
  decorators: [
    withMuiThemeProvider,
    withi18nProvider,
    withRouterProvider,
    story => (
      <FullHeightPageLayout bgcolor="grey.100">{story()}</FullHeightPageLayout>
    ),
  ],
} as Meta<typeof Hero>

type Story = StoryObj<typeof Hero>

export const Certified: Story = {
  decorators: [
    withAuthContext({ activeCertificates: [Course_Level_Enum.Level_1] }),
  ],
}

export const Uncertified: Story = {
  decorators: [withAuthContext({ activeCertificates: [] })],
}
