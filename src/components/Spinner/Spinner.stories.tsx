import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Spinner from '.'

export default {
  title: 'components/Spinner',
  component: Spinner,
} as ComponentMeta<typeof Spinner>

const Template: ComponentStory<typeof Spinner> = () => {
  return (
    <div className="w-screen h-screen relative">
      <Spinner cls="w-24 h-24 text-gray-600" />
    </div>
  )
}

export const Basic = Template.bind({})
