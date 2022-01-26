import React from 'react'
import { Routes, Route, NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'

import { MyTrainingPage } from '@app/pages/MyTraining'
import { TrainerBasePage } from '@app/pages/TrainerBase'

// TODO: will be generated later based on user/role
const tabs = [
  {
    id: 'trainer-base',
    title: 'Trainer Base',
  },
  {
    id: 'my-training',
    title: 'My Training',
  },
]

type LayoutProps = {
  tabs: { id: string; title: string }[]
}

// TODO: consider extracting when things grow here
const Layout: React.FC<LayoutProps> = ({ tabs }) => {
  return (
    <div>
      <div className="border-t border-divider flex bg-grey7">
        {tabs.map(tab => (
          <NavLink
            key={tab.id}
            to={tab.id}
            className={({ isActive }) =>
              clsx(
                'px-5 py-2 -mt-px',
                isActive
                  ? 'bg-white text-black border-t border-lime'
                  : 'text-grey1'
              )
            }
          >
            {tab.title}
          </NavLink>
        ))}
      </div>

      <div className="flex flex-col p-4">
        <Outlet />
      </div>
    </div>
  )
}

export const AppRoutes: React.FC<unknown> = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout tabs={tabs} />}>
        <Route path="trainer-base" element={<TrainerBasePage />} />
        <Route path="my-training" element={<MyTrainingPage />} />
      </Route>
    </Routes>
  )
}
