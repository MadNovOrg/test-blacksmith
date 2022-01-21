import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Input } from '.'

export default {
  title: 'components/Input',
  component: Input,
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = args => {
  const [validationError, setValidationError] = useState('')
  const [value, setValue] = useState('John')

  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-72">
        <Input
          {...args}
          type="text"
          value={value}
          error={validationError}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const eventValue = event?.target?.value
            setValidationError(!eventValue ? 'Please enter a name.' : '')
            setValue(eventValue)
          }}
        />
      </div>
    </div>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  label: 'First name',
  placeholder: 'Enter value here...',
}
