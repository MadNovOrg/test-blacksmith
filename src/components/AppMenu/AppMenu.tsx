import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Icon } from '../Icon'
import { Typography } from '../Typography'
import { useSession } from '../../auth'

type AppMenuProps = unknown

export const AppMenu: React.FC<AppMenuProps> = () => {
  const session = useSession()
  const navigate = useNavigate()

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex px-4 py-2 text-sm bg-white focus:outline-none ripple-bg-grey7 rounded">
          <Icon name="chevron-down" aria-hidden="true" />
          <Typography>Salman M</Typography>
        </Menu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded shadow-lg ring-1 ring-grey6 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    'group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-grey7',
                    active ? ' text-black' : 'text-grey'
                  )}
                >
                  <Icon name="computer" className="mr-2" />
                  <Typography>My Trainings</Typography>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    'group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-grey7',
                    active ? ' text-black' : 'text-grey'
                  )}
                >
                  <Icon name="cloud" className="mr-2" />
                  <Typography>My Organization</Typography>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    'group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-grey7',
                    active ? ' text-black' : 'text-grey'
                  )}
                  onClick={() => {
                    session.logout()
                    navigate('/login')
                  }}
                >
                  <Icon name="arrow-right" className="mr-2" />
                  <Typography>Logout</Typography>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
