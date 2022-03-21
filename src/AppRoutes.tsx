import React, { Suspense } from 'react'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/material'

import { AppLayout } from '@app/components/AppLayout'

import { useAuth } from '@app/context/auth'

import { MyProfilePage } from './pages/MyProfile'
import { Course } from './pages/TrainerBase/components/Course'
import { CourseBuilder } from './pages/TrainerBase/components/Course/components/CourseBuilder'
import { MyCourses } from './pages/TrainerBase/components/Course/components/MyCourses'
import { TrainerDashboard } from './pages/TrainerBase/components/TrainerDashboard'
import { Management as TrainerManagement } from './pages/TrainerBase/components/Management'
import { MyCalendar as TrainerCalendar } from './pages/TrainerBase/components//Management/components/MyCalendar'
import { ManageAvailability as TrainerAvailability } from './pages/TrainerBase/components//Management/components/ManageAvailability'
import { ManageExpenses as TrainerExpenses } from './pages/TrainerBase/components//Management/components/ManageExpenses'
import { ParticipantCourse } from './pages/MyTraining/ParticipantCourse'
import { CourseGradingDetails } from './pages/TrainerBase/components/CourseGradingDetails'
import { AcceptInvite } from './pages/MyTraining/AcceptInvite'
import { CourseAttendance } from './pages/TrainerBase/components/CourseGradingDetails/CourseAttendance'
import { ModulesSelection } from './pages/TrainerBase/components/CourseGradingDetails/ModulesSelection'
import { MembershipDetailsPage } from './pages/MembershipArea/MemberShipDetails'
import { BlogPage } from './pages/MembershipArea/BlogPage'
import { BlogPostPage } from './pages/MembershipArea/BlogPostPage'
import { CourseGrading } from './pages/TrainerBase/components/CourseGrading'

import { MyTrainingPage } from '@app/pages/MyTraining'
import { TrainerBasePage } from '@app/pages/TrainerBase'
import { MyOrganizationPage } from '@app/pages/MyOrganization'
import { OrganizationOverviewPage } from '@app/pages/MyOrganization/OrganizationOverviewPage'
import { ProfileListPage } from '@app/pages/MyOrganization/ProfileListPage'
import { LoginPage } from '@app/pages/Login'
import { SignUpPage } from '@app/pages/SignUp'
import { InvitationPage } from '@app/pages/Invitation'
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
import { CourseDetails } from '@app/pages/TrainerBase/components/CourseDetails'
import { AdminPage } from '@app/pages/admin'
import { Organizations } from '@app/pages/admin/components/Organizations'
import { Contacts } from '@app/pages/admin/components/Contacts'

const Trainers = React.lazy(
  () => import('@app/pages/admin/components/trainers')
)
const Trainees = React.lazy(
  () => import('@app/pages/admin/components/trainees')
)
const Plans = React.lazy(() => import('@app/pages/admin/components/plans'))

// TODO: consider extracting when things grow here
const Layout: React.FC = () => {
  return <Outlet />
}

const RedirectToLogin: React.FC = () => {
  const loc = useLocation()
  return <Navigate replace to="login" state={{ from: loc }} />
}

const LoggedInRoutes: React.FC<unknown> = () => {
  return (
    <AppLayout>
      <Suspense fallback={() => 'Loading'}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate replace to="trainer-base" />} />
            <Route path="my-profile" element={<MyProfilePage />} />
            <Route path="trainer-base" element={<TrainerBasePage />}>
              <Route index element={<TrainerDashboard />} />
              <Route path="course" element={<Course />}>
                <Route index element={<MyCourses />} />
                <Route path=":id/modules" element={<CourseBuilder />} />
                <Route path=":id/details" element={<CourseDetails />} />
                <Route path=":id/grading" element={<CourseGrading />} />
                <Route
                  path=":id/grading-details"
                  element={<CourseGradingDetails />}
                >
                  <Route element={<CourseAttendance />} index />
                  <Route path="modules" element={<ModulesSelection />} />
                </Route>
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
              <Route path="courses/:id" element={<ParticipantCourse />} />
              <Route path="accept-invite/:id" element={<AcceptInvite />} />
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
            <Route path="admin" element={<AdminPage />}>
              <Route index element={<Navigate to="organizations" />} />
              <Route path="organizations" element={<Organizations />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="trainers" element={<Trainers />} />
              <Route path="trainees" element={<Trainees />} />
              <Route path="plans" element={<Plans />} />
            </Route>
            <Route path="membership-area" element={<MembershipAreaPage />}>
              <Route index element={<Navigate to="details" />} />
              <Route path="details" element={<MembershipDetailsPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:postId" element={<BlogPostPage />} />
            </Route>
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
      <Route path="*" element={<RedirectToLogin />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="invitation" element={<InvitationPage />} />
      <Route
        path="contacted-confirmation"
        element={<ContactedConfirmationPage />}
      />
    </Routes>
  )
}

export const AppRoutes: React.FC<unknown> = () => {
  const auth = useAuth()
  const location = useLocation()

  if (location.pathname === '/invitation') {
    return <InvitationPage />
  }

  if (auth.loading) {
    return (
      <Box position="relative" width="100vw" height="100vh">
        <CircularProgress
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          size={60}
        />
      </Box>
    )
  }

  if (!auth.accessToken) {
    return <LoggedOutRoutes />
  }

  return <LoggedInRoutes />
}
