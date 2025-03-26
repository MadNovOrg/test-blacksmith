import { Meta, StoryFn } from '@storybook/react'

import ProgressBar from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/ProgressBar',
  component: ProgressBar,
  decorators: [withMuiThemeProvider],
} as Meta<typeof ProgressBar>

const Template: StoryFn<typeof ProgressBar> = args => {
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
