import React, { useState } from 'react'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'

type SwitchProps = {
  label?: string
  defaultValue?: boolean
  onChange?: (checked: boolean) => void
  children?: React.ReactNode
}

export const ToggleSwitch: React.FC<SwitchProps> = ({
  label = '',
  defaultValue = true,
  onChange,
  children,
}) => {
  const [enabled, setEnabled] = useState(defaultValue)

  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch
          checked={enabled}
          onChange={val => {
            if (onChange) {
              onChange(val)
            }
            setEnabled(val)
          }}
          className={clsx(
            'relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none',
            {
              'bg-lime': enabled,
              'bg-grey3': !enabled,
            }
          )}
        >
          <span
            className={clsx(
              'inline-block w-4 h-4 transform bg-white rounded-full transition-transform',
              {
                'translate-x-6': enabled,
                'translate-x-1': !enabled,
              }
            )}
          />
        </Switch>
        <Switch.Label className="ml-2">
          <span
            className={clsx({
              'text-navy': enabled,
              'text-grey3': !enabled,
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
