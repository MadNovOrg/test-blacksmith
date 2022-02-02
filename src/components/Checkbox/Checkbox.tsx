import React from 'react'
import clsx from 'clsx'

import { Typography } from '../Typography'

export type CheckboxProps = {
  id: string
  text: string
  error: boolean
}

export const Checkbox: React.FC<
  CheckboxProps & React.HTMLProps<HTMLInputElement>
> = ({ id, text, error = false, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className={clsx('mr-1', { 'border-red': error })}
        {...props}
      />
      <label htmlFor={id} className="ml-2">
        <Typography variant="body1">{text}</Typography>
      </label>
    </div>
  )
}
