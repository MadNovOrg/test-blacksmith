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
      mandatory: true,
      modules: [
        {
          id: 'Values exercise',
          name: 'Values exercise',
          covered: true,
          submodules: [],
        },
        {
          id: 'Legal framework',
          name: 'Legal framework',
          covered: true,
          submodules: [],
        },
      ],
    },
    {
      id: 'CORE - Personal Space & Body Language Module',
      name: 'CORE - Personal Space & Body Language Module',
      mandatory: false,
      modules: [
        {
          id: 'Circles of danger  ',
          name: 'Circles of danger  ',
          covered: true,
          submodules: [],
        },
        {
          id: 'Posturing and body language ',
          name: 'Posturing and body language ',
          covered: true,
          submodules: [],
        },
      ],
    },
  ],
}
