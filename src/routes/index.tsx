import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React, { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { AppLayout } from '@app/components/AppLayout'
import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import { AutoLogin } from '@app/pages/common/AutoLogin'
import { AutoRegisterPage } from '@app/pages/common/AutoRegister'
import { BookPrivateCourse } from '@app/pages/common/BookPrivateCourse'
import { ChangePasswordPage } from '@app/pages/common/ChangePassword'
import { CourseBookingPage } from '@app/pages/common/CourseBooking'
import { CourseBookingDone } from '@app/pages/common/CourseBooking/components/CourseBookingDone'
import { CourseEnquiry } from '@app/pages/common/CourseEnquiry'
import { CourseWaitlist } from '@app/pages/common/CourseWaitlist'
import { ForgotPasswordPage } from '@app/pages/common/ForgotPassword'
import { LoginPage } from '@app/pages/common/Login'
import { RegistrationPage } from '@app/pages/common/Registration'
import { ResetPasswordPage } from '@app/pages/common/ResetPassword'
import { ContactedConfirmationPage } from '@app/pages/ContactedConfirmation'
import { InvitationPage } from '@app/pages/Invitation'
import { OrgInvitationPage } from '@app/pages/Invitation/OrgInvitation'
import { RoleName } from '@app/types'

const ProfileRoutes = React.lazy(() => import('./profile'))
const TrainerRoutes = React.lazy(() => import('./trainer-routes'))
const UserRoutes = React.lazy(() => import('./user-routes'))
const TTRoutes = React.lazy(() => import('./tt-routes'))
const UnverifiedRoutes = React.lazy(() => import('./unverified-routes'))
const SalesAdminRoutes = React.lazy(() => import('./sales-admin-routes'))

const roleRoutesMap = {
  [RoleName.SALES_REPRESENTATIVE]: UnverifiedRoutes,
  [RoleName.SALES_ADMIN]: SalesAdminRoutes,
  [RoleName.FINANCE]: UnverifiedRoutes,
  [RoleName['L&D']]: UnverifiedRoutes,
  [RoleName.TRAINER]: TrainerRoutes,
  [RoleName.USER]: UserRoutes,
  [RoleName.TT_OPS]: TTRoutes,
  [RoleName.TT_ADMIN]: TTRoutes,
  [RoleName.UNVERIFIED]: UnverifiedRoutes,
} as const

export const AppRoutes = () => {
  const auth = useAuth()
  const location = useLocation()

  if (location.pathname === '/invitation') {
    return <InvitationPage />
  }

  if (location.pathname === '/org-invitation') {
    return <OrgInvitationPage />
  }

  if (location.pathname === '/auto-login') {
    return <AutoLogin />
  }

  if (location.pathname === '/waitlist') {
    return <CourseWaitlist />
  }

  if (location.pathname === '/enquiry') {
    return <CourseEnquiry />
  }

  if (location.pathname === '/book-private-course') {
    return <BookPrivateCourse />
  }

  if (location.pathname === '/change-password') {
    return <ChangePasswordPage />
  }

  if (auth.loading) {
    return <AppLoading />
  }

  if (!auth.profile) {
    return <LoggedOutRoutes />
  }

  return <LoggedInRoutes />
}

function LoggedOutRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate replace to="login" />} />
      <Route path="*" element={<RedirectToLogin />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="invitation" element={<InvitationPage />} />
      <Route path="org-invitation" element={<OrgInvitationPage />} />
      <Route path="registration" element={<RegistrationPage />} />
      <Route path="auto-register" element={<AutoRegisterPage />} />
      <Route
        path="contacted-confirmation"
        element={<ContactedConfirmationPage />}
      />
    </Routes>
  )
}

function LoggedInRoutes() {
  const { activeRole } = useAuth()

  if (!activeRole) return null

  const RouteComp = roleRoutesMap[activeRole]

  return (
    <AppLayout>
      <Suspense fallback={<SuspenseLoading />}>
        <Routes>
          <Route path="profile/*" element={<ProfileRoutes />} />
          <Route path="booking/*" element={<CourseBookingPage />} />
          <Route path="booking/done" element={<CourseBookingDone />} />

          {/* This is a dummy registration page to capture course/qty for course booking for logged in users */}
          <Route path="registration" element={<RegistrationPage />} />

          <Route path="*" element={<RouteComp />} />

          <Route path="login/*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </AppLayout>
  )
}

function RedirectToLogin() {
  const { pathname, search } = useLocation()
  return <Navigate replace to="login" state={{ from: { pathname, search } }} />
}

function AppLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 5,
      }}
    >
      <CircularProgress size={60} />
    </Box>
  )
}
