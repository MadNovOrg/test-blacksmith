import React from 'react'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'

type RadioButtonOption = {
  label: string
  value: string
}

type RadioButtonGroupProps = {
  label?: string
  options: RadioButtonOption[]
  value: string
  onChange: (value: string) => void
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  label = '',
  options,
  value,
  onChange,
  ...props
}) => {
  return (
    <RadioGroup value={value} onChange={onChange} {...props}>
      <RadioGroup.Label className="text-xs">{label}</RadioGroup.Label>
      <div className="py-1">
        {options.map((option, index) => (
          <RadioGroup.Option
            value={option.value}
            key={index}
            className="group p-1.5 hover:bg-grey7"
          >
            <span
              className={clsx(
                'rounded-full ml-2 h-3 w-3 transition duration-200 mt-2 align-top float-left ring-1 ring-offset-4 ring-offset-white ring-grey3 group-focus:ring-navy',
                {
                  'bg-lime1': value === option.value,
                  'bg-white': value !== option.value,
                }
              )}
            />
            <span className="ml-4 text-base align-middle">{option.label}</span>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
