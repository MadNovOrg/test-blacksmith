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
    <div className="flex">
      <input
        id={id}
        type="checkbox"
        className={clsx(
          'checked:bg-lime mb-3 mt-1 border-grey3 checked:border-grey text-lime focus:ring-lime h-4 w-4 rounded mr-1',
          { 'border-red': error }
        )}
        {...props}
      />
      <label htmlFor={id} className="ml-2">
        <Typography variant="body1">{text}</Typography>
      </label>
    </div>
  )
}
