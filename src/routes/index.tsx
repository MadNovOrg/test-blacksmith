import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React, { Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { AppLayout } from '@app/components/AppLayout'
import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import { CourseRegistrationPage } from '@app/pages/common/CourseRegistration'
import { ForgotPasswordPage } from '@app/pages/common/ForgotPassword'
import { LoginPage } from '@app/pages/common/Login'
import { ResetPasswordPage } from '@app/pages/common/ResetPassword'
import { ContactedConfirmationPage } from '@app/pages/ContactedConfirmation'
import { InvitationPage } from '@app/pages/Invitation'
import { RoleName } from '@app/types'

const ProfileRoutes = React.lazy(() => import('./profile'))
const TrainerRoutes = React.lazy(() => import('./trainer-routes'))
const UserRoutes = React.lazy(() => import('./user-routes'))
const OrgAdminRoutes = React.lazy(() => import('./org-admin-routes'))
const TTOpsRoutes = React.lazy(() => import('./tt-ops-routes'))
const TTAdminRoutes = React.lazy(() => import('./tt-admin-routes'))
const UnverifiedRoutes = React.lazy(() => import('./unverified-routes'))

const roleRoutesMap = {
  [RoleName.TRAINER]: TrainerRoutes,
  [RoleName.USER]: UserRoutes,
  [RoleName.ORG_ADMIN]: OrgAdminRoutes,
  [RoleName.TT_OPS]: TTOpsRoutes,
  [RoleName.TT_ADMIN]: TTAdminRoutes,
  [RoleName.UNVERIFIED]: UnverifiedRoutes,
} as const

export const AppRoutes = () => {
  const auth = useAuth()
  const location = useLocation()

  if (location.pathname === '/invitation') {
    return <InvitationPage />
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
      <Route path="registration" element={<CourseRegistrationPage />} />
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

          {/* This is a dummy registration page to capture course/qty for course booking */}
          <Route path="registration" element={<CourseRegistrationPage />} />

          <Route path="*" element={<RouteComp />} />

          <Route path="login/*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </AppLayout>
  )
}

function RedirectToLogin() {
  const loc = useLocation()
  return <Navigate replace to="login" state={{ from: loc }} />
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
