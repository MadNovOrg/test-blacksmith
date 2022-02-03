import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { Typography } from '@app/components/Typography'
import { Icon } from '@app/components/Icon'

type CourseProps = unknown

const menu = [
  {
    to: 'create',
    title: 'New Course',
  },
  {
    to: 'history',
    title: 'View History',
  },
  {
    to: 'templates',
    title: 'Templates',
  },
]

export const Course: React.FC<CourseProps> = () => {
  return (
    <div className="flex">
      <div className="w-48 hidden sm:flex sm:flex-col">
        <div className="flex mb-8">
          <Icon name="arrow-left" />
          <Typography className="ml-2">Back</Typography>
        </div>

        <div className="flex flex-col">
          {menu.map(m => (
            <Typography key={m.to} variant="body2" className="py-3">
              <NavLink
                to={m.to}
                className={({ isActive }) =>
                  isActive ? 'border-b border-lime-500 font-bold' : ''
                }
              >
                {m.title}
              </NavLink>
            </Typography>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-2 sm:pt-16">
        <Outlet />
      </div>
    </div>
  )
}
