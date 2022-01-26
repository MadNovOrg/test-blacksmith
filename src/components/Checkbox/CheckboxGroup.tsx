import React from 'react'

import { Checkbox } from './Checkbox'

type inputItem = {
  id: string
  text: string
}

export type CheckboxGroupProps = {
  error: boolean
  items: inputItem[]
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  items,
  error,
}) => {
  return (
    <div>
      {items.map((option, index) => (
        <div key={option.id}>
          <Checkbox text={option.text} error={error} id={index.toString()} />
        </div>
      ))}
    </div>
  )
}
