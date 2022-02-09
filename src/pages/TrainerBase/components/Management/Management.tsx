import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Icon } from '@app/components/Icon'

type ManagementProps = unknown

const menu = [
  {
    to: 'calendar',
    title: 'My Calendar',
  },
  {
    to: 'availability',
    title: 'Manage Availability',
  },
  {
    to: 'expenses',
    title: 'Manage Expenses',
  },
]

export const Management: React.FC<ManagementProps> = () => {
  const navigate = useNavigate()

  return (
    <div className="flex">
      <div className="w-48 hidden sm:flex sm:flex-col">
        <button className="flex mb-8 items-center" onClick={() => navigate(-1)}>
          <Icon name="arrow-left" />
          <p className="ml-2 text-sm">Back</p>
        </button>

        <div className="flex flex-col">
          {menu.map(m => (
            <NavLink key={m.to} to={m.to} className="py-3 text-sm">
              {({ isActive }) => (
                <p
                  className={
                    isActive ? 'inline border-b border-lime-500 font-bold' : ''
                  }
                >
                  {m.title}
                </p>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-2 sm:pt-16">
        <Outlet />
      </div>
    </div>
  )
}
