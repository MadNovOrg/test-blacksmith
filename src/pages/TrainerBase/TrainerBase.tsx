import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { Typography } from '@app/components/Typography'
import { Icon } from '@app/components/Icon'

type TrainerBasePageProps = unknown

const menu = [
  {
    to: 'new-course',
    title: 'New Course',
  },
  {
    to: 'course-history',
    title: 'View History',
  },
  {
    to: 'course-templates',
    title: 'Templates',
  },
]

export const TrainerBasePage: React.FC<TrainerBasePageProps> = () => {
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
                  isActive ? 'border-b border-lime font-bold' : ''
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
