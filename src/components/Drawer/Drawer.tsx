import React from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { IconButton } from '../IconButton'
import { Typography } from '../Typography'

import { MenuItem } from './components/MenuItem'

type DrawerProps = {
  open: boolean
  onClose: VoidFunction
}

// TODO: menu will be built based on user/role
const menu = [
  {
    to: '/trainer-base',
    title: 'Trainer Base',
    children: [
      { to: '/trainer-base/new-course', title: 'New Course' },
      { to: '/trainer-base/course-history', title: 'Course History' },
      { to: '/trainer-base/course-templates', title: 'Course Templates' },
    ],
  },
  {
    to: '/my-training',
    title: 'My Training',
  },
]

export const Drawer: React.FC<DrawerProps> = ({ open, onClose }) => {
  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={onClose}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={React.Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="absolute inset-0 bg-grey/50 transition-opacity"
              onClick={onClose}
            />
          </Transition.Child>
          <div className="fixed inset-y-0 right-0 max-w-[90%] flex">
            <Transition.Child
              as={React.Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex items-start p-1 pb-4">
                    <IconButton name="close" onClick={onClose} />
                  </div>
                  <div className="mx-8 pb-4 border-b border-b-lime">
                    <Typography
                      variant="body2"
                      startIcon={
                        <img
                          className="inline-block h-12 w-12 rounded-full ring-1 ring-lime"
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                          alt="avatar"
                        />
                      }
                    >
                      User Name
                    </Typography>
                  </div>
                  <div className="mt-6 px-8 relative flex-1 overflow-y-scroll flex flex-col">
                    {menu.map(m => (
                      <MenuItem key={m.to} item={m} />
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
