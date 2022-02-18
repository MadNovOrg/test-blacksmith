import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

import { Icon } from '../Icon'
import { Typography } from '../Typography'

type AppMenuProps = unknown

export const AppMenu: React.FC<AppMenuProps> = () => {
  const { profile, logout } = useAuth()

  if (!profile) return null

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <Menu.Button data-id="user-menu-btn" as={Fragment}>
        {({ open }) => (
          <button
            className={clsx(
              'inline-flex px-4 py-2 text-sm bg-white focus:outline-none rounded-t',
              'border-t border-l border-r',
              open ? 'border-divider' : 'border-white'
            )}
          >
            <Icon
              name={open ? 'chevron-up' : 'chevron-down'}
              aria-hidden="true"
            />
            <Typography>
              {profile.givenName} {profile.familyName.charAt(0)}
            </Typography>
          </button>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-[1px] w-56 -mt-[1px] origin-top-right bg-white rounded-b rounded-l ring-1 ring-divider focus:outline-none -z-10">
          <div className="px-3 py-1">
            <Menu.Item>
              <Link
                className="group flex justify-between items-center w-full py-2 text-sm underline-offset-4 hover:underline border-b border-divider"
                to="/my-profile"
              >
                View or edit account
                <Icon name="keyboard-arrow-right" className="ml-2" />
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                className="group flex justify-between items-center w-full py-2 text-sm underline-offset-4 hover:underline border-b border-divider"
                to="/notifications"
              >
                Notifications
                <Icon name="keyboard-arrow-right" className="ml-2" />
              </Link>
            </Menu.Item>
            <Menu.Item>
              <button
                className="group flex justify-between items-center w-full py-2 text-sm underline-offset-4 hover:underline"
                onClick={() => logout()}
              >
                Log Out
                <Icon name="exit" className="ml-2" />
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
