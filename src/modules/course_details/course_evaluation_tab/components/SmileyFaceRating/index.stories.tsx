import { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import { SmileyFaceRating } from '.'

export default {
  title: 'components/SmileyFaceRating',
  component: SmileyFaceRating,
} as Meta<typeof SmileyFaceRating>

const Template: StoryFn<typeof SmileyFaceRating> = args => {
  return <SmileyFaceRating {...args} />
}

export const Basic = Template.bind({})
