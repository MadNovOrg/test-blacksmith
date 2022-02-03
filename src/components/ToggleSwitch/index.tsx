import React from 'react'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'

type SwitchProps = {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  children?: React.ReactNode
}

export const ToggleSwitch: React.FC<SwitchProps> = ({
  label = '',
  checked,
  onChange,
  children,
}) => {
  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch
          checked={checked}
          onChange={onChange}
          className={clsx(
            'relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none',
            {
              'bg-lime': checked,
              'bg-gray-50': !checked,
            }
          )}
        >
          <span
            className={clsx(
              'inline-block w-4 h-4 transform bg-white rounded-full transition-transform',
              {
                'translate-x-6': checked,
                'translate-x-1': !checked,
              }
            )}
          />
        </Switch>
        <Switch.Label className="ml-2">
          <span
            className={clsx({
              'text-navy': checked,
              'text-gray-50': !checked,
            })}
          >
            {label}
          </span>
          {children}
        </Switch.Label>
      </div>
    </Switch.Group>
  )
}
