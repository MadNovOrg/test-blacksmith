import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import ProgressBar from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/ProgressBar',
  component: ProgressBar,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof ProgressBar>

const Template: ComponentStory<typeof ProgressBar> = args => {
  return (
    <div className="w-40">
      <ProgressBar {...args} />
    </div>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  percentage: 50,
}
