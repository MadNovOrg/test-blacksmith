import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Icon } from '../Icon/Icon'

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
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-grey4 bg-white">
                <span>{title}</span>
                <Icon
                  name="chevron-up"
                  aria-hidden="true"
                  className="w-5 h-5 ml-2 -mr-1"
                />
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
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-grey6 shadow-greenBottom outline-none"
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
                                'bg-grey7': active,
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
