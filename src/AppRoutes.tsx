import React from 'react'
import { Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom'
import clsx from 'clsx'

import { AppLayout } from '@app/components/AppLayout'

import Spinner from './components/Spinner'
import { Course } from './pages/TrainerBase/components/Course'
import { CourseView } from './pages/TrainerBase/components/Course/components/CourseView'
import { CourseHistory } from './pages/TrainerBase/components/Course/components/CourseHistory'
import { CourseCreate } from './pages/TrainerBase/components/Course/components/CourseCreate'
import { CourseTemplates } from './pages/TrainerBase/components/Course/components/CourseTemplates'
import { TrainerDashboard } from './pages/TrainerBase/components/TrainerDashboard'

import { MyTrainingPage } from '@app/pages/MyTraining'
import { TrainerBasePage } from '@app/pages/TrainerBase'
import { useSession } from '@app/auth'
import { LoginPage } from '@app/pages/Login'

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
      <div className="border-t border-divider bg-gray-50 hidden sm:flex">
        {tabs.map(tab => (
          <NavLink
            key={tab.id}
            to={tab.id}
            className={({ isActive }) =>
              clsx(
                'relative z-10 px-2 w-48 py-2 -mt-px text-center',
                isActive
                  ? 'bg-white text-black border-t-2 border-lime-500'
                  : 'text-gray-400'
              )
            }
          >
            {tab.title}
          </NavLink>
        ))}
      </div>

      <div className="flex flex-col py-4">
        <Outlet />
      </div>
    </div>
  )
}

const LoggedInRoutes: React.FC<unknown> = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Layout tabs={tabs} />}>
          <Route path="trainer-base" element={<TrainerBasePage />}>
            <Route index element={<TrainerDashboard />} />
            <Route path="course" element={<Course />}>
              <Route index element={<Navigate replace to="create" />} />
              <Route path="create" element={<CourseCreate />} />
              <Route path="view/:id" element={<CourseView />} />
              <Route path="history" element={<CourseHistory />} />
              <Route path="templates" element={<CourseTemplates />} />
            </Route>
          </Route>
          <Route path="my-training" element={<MyTrainingPage />} />
        </Route>
      </Routes>
    </AppLayout>
  )
}

const LoggedOutRoutes: React.FC<unknown> = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  )
}

export const AppRoutes: React.FC<unknown> = () => {
  const session = useSession()

  if (session.loading) {
    return (
      <main className="w-screen h-screen relative">
        <Spinner cls="w-16 h-16" />
      </main>
    )
  }

  console.log(session)

  if (session.accessToken === null) {
    return <LoggedOutRoutes />
  }

  return <LoggedInRoutes />
}
