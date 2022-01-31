import React from 'react'
import { Meta, Story } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { CustomLink, CustomLinkProps } from '.'

export default {
  title: 'components/Link',
  component: CustomLink,
} as Meta

const CustomLinkTemplate: Story<CustomLinkProps> = args => (
  <BrowserRouter>
    <div className="flex gap-4">
      <CustomLink {...args} />
    </div>
  </BrowserRouter>
)

export const Primary = CustomLinkTemplate.bind({})

const Text = () => {
  return <div>Default link text</div>
}

Primary.args = {
  children: <Text />,
  to: '',
}
