import React, { Suspense } from 'react'
import { Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom'
import clsx from 'clsx'

import { AppLayout } from '@app/components/AppLayout'

import { useAuth } from '@app/context/auth'

import Spinner from './components/Spinner'
import { MyProfilePage } from './pages/MyProfile'
import { Course } from './pages/TrainerBase/components/Course'
import { CourseView } from './pages/TrainerBase/components/Course/components/CourseView'
import { CourseHistory } from './pages/TrainerBase/components/Course/components/CourseHistory'
import { CourseCreate } from './pages/TrainerBase/components/Course/components/CourseCreate'
import { CourseTemplates } from './pages/TrainerBase/components/Course/components/CourseTemplates'
import { TrainerDashboard } from './pages/TrainerBase/components/TrainerDashboard'
import { Management as TrainerManagement } from './pages/TrainerBase/components/Management'
import { MyCalendar as TrainerCalendar } from './pages/TrainerBase/components//Management/components/MyCalendar'
import { ManageAvailability as TrainerAvailability } from './pages/TrainerBase/components//Management/components/ManageAvailability'
import { ManageExpenses as TrainerExpenses } from './pages/TrainerBase/components//Management/components/ManageExpenses'

import { MyTrainingPage } from '@app/pages/MyTraining'
import { TrainerBasePage } from '@app/pages/TrainerBase'
import { MyOrganizationPage } from '@app/pages/MyOrganization'
import { OrganizationOverviewPage } from '@app/pages/MyOrganization/OrganizationOverviewPage'
import { ProfileListPage } from '@app/pages/MyOrganization/ProfileListPage'
import { LoginPage } from '@app/pages/Login'
import { ProfilePage } from '@app/pages/MyOrganization/ProfilePage'
import { MyTrainingDashboard } from '@app/pages/MyTraining/MyTrainingDashboard'
import { MyCertifications } from '@app/pages/MyTraining/MyCertifications'
import { MyResources } from '@app/pages/MyTraining/MyResources'
import { MyMembership } from '@app/pages/MyTraining/MyMembership'
import { MyUpcomingTraining } from '@app/pages/MyTraining/MyUpcomingTraining'
import { ForgotPasswordPage } from '@app/pages/ForgotPassword'
import { ResetPasswordPage } from '@app/pages/ResetPassword'
import { ContactedConfirmationPage } from '@app/pages/ContactedConfirmation'
import { MembershipAreaPage } from '@app/pages/MembershipArea'

const Dashboard = React.lazy(() => import('@app/pages/admin/dashboard'))
const Organizations = React.lazy(
  () => import('@app/pages/admin/components/organizations')
)
const Trainers = React.lazy(
  () => import('@app/pages/admin/components/trainers')
)
const Trainees = React.lazy(
  () => import('@app/pages/admin/components/trainees')
)
const Plans = React.lazy(() => import('@app/pages/admin/components/plans'))

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
  {
    id: 'my-organization',
    title: 'My Organization',
  },
  {
    id: 'admin',
    title: 'Admin',
  },
  {
    id: 'membership-area',
    title: 'Membership Area',
  },
]

type LayoutProps = {
  tabs: { id: string; title: string }[]
}

// TODO: consider extracting when things grow here
const Layout: React.FC<LayoutProps> = ({ tabs }) => {
  return (
    <>
      <div
        className="border-t border-divider bg-gray-50 hidden sm:flex"
        data-id="nav-menu"
      >
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
      <div className="flex flex-col py-4 flex-1">
        <Outlet />
      </div>
    </>
  )
}

const LoggedInRoutes: React.FC<unknown> = () => {
  return (
    <AppLayout>
      <Suspense fallback={() => 'Loading'}>
        <Routes>
          <Route path="/" element={<Layout tabs={tabs} />}>
            <Route path="my-profile" element={<MyProfilePage />} />
            <Route path="trainer-base" element={<TrainerBasePage />}>
              <Route index element={<TrainerDashboard />} />
              <Route path="course" element={<Course />}>
                <Route index element={<Navigate replace to="create" />} />
                <Route path="create" element={<CourseCreate />} />
                <Route path="view/:id" element={<CourseView />} />
                <Route path="history" element={<CourseHistory />} />
                <Route path="templates" element={<CourseTemplates />} />
              </Route>
              <Route path="management" element={<TrainerManagement />}>
                <Route index element={<Navigate replace to="calendar" />} />
                <Route path="calendar" element={<TrainerCalendar />} />
                <Route path="availability" element={<TrainerAvailability />} />
                <Route path="expenses" element={<TrainerExpenses />} />
              </Route>
            </Route>
            <Route path="my-training" element={<MyTrainingPage />}>
              <Route index element={<MyTrainingDashboard />} />
              <Route
                path="upcoming-training"
                element={<MyUpcomingTraining />}
              />
              <Route path="certifications" element={<MyCertifications />} />
              <Route path="resources" element={<MyResources />} />
              <Route path="membership" element={<MyMembership />} />
            </Route>
            <Route path="my-organization" element={<MyOrganizationPage />}>
              <Route index element={<Navigate to="overview" />} />
              <Route path="overview" element={<OrganizationOverviewPage />} />
              <Route path="profiles" element={<ProfileListPage />} />
              <Route path="profiles/:id" element={<ProfilePage />} />
            </Route>
            <Route path="admin" element={<Dashboard />}>
              <Route index element={<Navigate to="organizations" />} />
              <Route path="organizations" element={<Organizations />} />
              <Route path="trainers" element={<Trainers />} />
              <Route path="trainees" element={<Trainees />} />
              <Route path="plans" element={<Plans />} />
            </Route>
            <Route
              path="membership-area"
              element={<MembershipAreaPage />}
            ></Route>
          </Route>
        </Routes>
      </Suspense>
    </AppLayout>
  )
}

const LoggedOutRoutes: React.FC<unknown> = () => {
  return (
    <Routes>
      <Route index element={<Navigate replace to="login" />} />
      <Route path="*" element={<Navigate replace to="login" />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route
        path="contacted-confirmation"
        element={<ContactedConfirmationPage />}
      />
    </Routes>
  )
}

export const AppRoutes: React.FC<unknown> = () => {
  const auth = useAuth()

  if (auth.loading) {
    return (
      <main className="w-screen h-screen relative">
        <Spinner cls="w-16 h-16" />
      </main>
    )
  }

  if (!auth.accessToken) {
    return <LoggedOutRoutes />
  }

  return <LoggedInRoutes />
}
