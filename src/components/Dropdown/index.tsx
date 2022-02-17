import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Icon } from '../Icon/Icon'
import { Typography } from '../Typography'

export type DropdownProps = {
  title: string
  items: string[]
  handleClick(item: string): unknown
}

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  items,
  handleClick,
}) => {
  return (
    <div className="relative inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <span className="shadow-sm">
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 border-gray-300 bg-white">
                <span>
                  <Typography variant="body1">{title}</Typography>
                </span>
                <Icon name="chevron-down" aria-hidden="true" />
              </Menu.Button>
            </span>

            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 left-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-50 shadow-greenBottom outline-none"
              >
                <div className="px-1 py-1 ">
                  {items.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          handleClick(item)
                        }}
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <span
                              className={`${clsx({
                                'bg-gray-50': active,
                              })} flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                            >
                              {item}
                            </span>
                          )}
                        </Menu.Item>
                      </div>
                    )
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
