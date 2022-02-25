import { Disclosure, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'

import { Icon } from '../Icon'
import { IconButton } from '../IconButton'

export type FilterOption = { id: string; title: string; selected: boolean }

type FilterAccordionProps = {
  className?: string
  title: string
  options: FilterOption[]
  onChange: (_: FilterOption[]) => void
}

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
  className = '',
  title,
  options,
  onChange,
}) => {
  const handleChange = (item: FilterOption) =>
    onChange(
      options.map(o =>
        o.id === item.id ? { ...o, selected: !item.selected } : o
      )
    )

  return (
    <div className={`flex flex-col ${className}`}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center pr-1">
              <p className="text-sm text-gray-400">{title}</p>
              <Icon name={open ? 'chevron-up' : 'chevron-down'} />
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel>
                <div className="flex flex-col">
                  <ul className="flex flex-col text-sm pl-2 pt-4">
                    {options.map(item => (
                      <li key={item.id} className="flex items-center h-8">
                        <p
                          className={clsx('flex-1', {
                            'font-semibold': item.selected,
                          })}
                          role="button"
                          onClick={() => handleChange(item)}
                        >
                          {item.title}
                        </p>
                        {item.selected && (
                          <IconButton
                            name="close"
                            size="sm"
                            onClick={() => handleChange(item)}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  )
}
