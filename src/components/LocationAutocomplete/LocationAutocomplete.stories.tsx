import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import LocationAutocomplete from '.'

export default {
  title: 'components/LocationAutocomplete',
  component: LocationAutocomplete,
} as ComponentMeta<typeof LocationAutocomplete>

const Template: ComponentStory<typeof LocationAutocomplete> = args => {
  return (
    <div className="w-40">
      <LocationAutocomplete
        {...args}
        textFieldProps={{ variant: 'standard' }}
        sx={{ maxWidth: 'sm' }}
        onChange={(value: string | null) =>
          console.log('value changed to: ', value)
        }
      />
    </div>
  )
}

export const Basic = Template.bind({})
