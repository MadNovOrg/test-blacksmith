import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { ModulesSelectionList } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'pages/CourseGradingDetails/ModulesSelectionList',
  component: ModulesSelectionList,
  decorators: [withMuiThemeProvider],
} as ComponentMeta<typeof ModulesSelectionList>

const Template: ComponentStory<typeof ModulesSelectionList> = args => (
  <ModulesSelectionList {...args} />
)

export const Default = Template.bind({})
Default.args = {
  moduleGroups: [
    {
      id: 'CORE - Theory Module',
      name: 'CORE - Theory Module',
      modules: [
        { id: 'Values excercise', name: 'Values excercise', covered: true },
        { id: 'Legal framework', name: 'Legal framework', covered: true },
      ],
    },
    {
      id: 'CORE - Personal Space & Body Language Module',
      name: 'CORE - Personal Space & Body Language Module',
      modules: [
        {
          id: 'Circles of danger  ',
          name: 'Circles of danger  ',
          covered: true,
        },
        {
          id: 'Posturing and body language ',
          name: 'Posturing and body language ',
          covered: true,
        },
      ],
    },
  ],
}
