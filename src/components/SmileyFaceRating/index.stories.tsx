import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { SmileyFaceRating } from '.'

export default {
  title: 'components/SmileyFaceRating',
  component: SmileyFaceRating,
} as ComponentMeta<typeof SmileyFaceRating>

const Template: ComponentStory<typeof SmileyFaceRating> = args => {
  return <SmileyFaceRating {...args} />
}

export const Basic = Template.bind({})
