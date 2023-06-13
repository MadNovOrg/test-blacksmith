import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React, { ReactNode, Suspense, useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { AppLayout } from '@app/components/AppLayout'
import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { GettingStartedModal } from '@app/components/GettingStartedModal'
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
import { GettingStarted } from '@app/pages/GettingStarted'
import { InvitationPage } from '@app/pages/Invitation'
import { OrgInvitationPage } from '@app/pages/Invitation/OrgInvitation'
import { Onboarding } from '@app/pages/Onboarding'
import { Welcome } from '@app/pages/Welcome'
import { RoleName } from '@app/types'

const ProfileRoutes = React.lazy(() => import('./profile'))
const TrainerRoutes = React.lazy(() => import('./trainer-routes'))
const UserRoutes = React.lazy(() => import('./user-routes'))
const TTRoutes = React.lazy(() => import('./tt-routes'))
const UnverifiedRoutes = React.lazy(() => import('./unverified-routes'))
const SalesAdminRoutes = React.lazy(() => import('./sales-admin-routes'))
const SalesRepresentativeRoute = React.lazy(
  () => import('./sales-representative-routes')
)
const FinanceRoute = React.lazy(() => import('./finance-routes'))

const roleRoutesMap = {
  [RoleName.SALES_REPRESENTATIVE]: SalesRepresentativeRoute,
  [RoleName.SALES_ADMIN]: SalesAdminRoutes,
  [RoleName.FINANCE]: FinanceRoute,
  [RoleName.TRAINER]: TrainerRoutes,
  [RoleName.BOOKING_CONTACT]: UserRoutes,
  [RoleName.USER]: UserRoutes,
  [RoleName.LD]: TTRoutes,
  [RoleName.TT_OPS]: TTRoutes,
  [RoleName.TT_ADMIN]: TTRoutes,
  [RoleName.UNVERIFIED]: UnverifiedRoutes,
  [RoleName.ANONYMOUS]: UnverifiedRoutes,
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
  const { activeRole, profile } = useAuth()
  const navigate = useNavigate()

  const [showGettingStartedModal, setShowGettingStartedModal] = useState(false) // initial state should be firstTimeLogin || longTimeSinceLastLogin

  useEffect(() => {
    if (!profile?.givenName || !profile.familyName) {
      navigate('onboarding')
    }
  }, [profile, navigate])

  if (!activeRole) return null

  const RouteComp = roleRoutesMap[activeRole]

  return (
    <>
      <GettingStartedModal
        open={showGettingStartedModal}
        onClose={() => setShowGettingStartedModal(false)}
      />

      <Routes>
        <Route
          index
          element={
            <AppShell>
              <Welcome />
            </AppShell>
          }
        />

        <Route
          path="getting-started/:id?"
          element={
            <AppShell>
              <GettingStarted />
            </AppShell>
          }
        />

        <Route
          path="profile/*"
          element={
            <AppShell>
              <ProfileRoutes />
            </AppShell>
          }
        />
        <Route
          path="booking/*"
          element={
            <AppShell>
              <CourseBookingPage />
            </AppShell>
          }
        />
        <Route
          path="booking/done"
          element={
            <AppShell>
              <CourseBookingDone />
            </AppShell>
          }
        />
        <Route
          path="onboarding"
          element={
            <AppLayoutMinimal width={628}>
              <Suspense fallback={<AppLoading />}>
                <Onboarding />
              </Suspense>
            </AppLayoutMinimal>
          }
        />

        {/* This is a dummy registration page to capture course/qty for course booking for logged in users */}
        <Route
          path="registration"
          element={
            <AppShell>
              <RegistrationPage />
            </AppShell>
          }
        />

        <Route
          path="*"
          element={
            <AppShell>
              <RouteComp />
            </AppShell>
          }
        />

        <Route path="login/*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  )
}

function RedirectToLogin() {
  const { pathname, search } = useLocation()
  const auth = useAuth()

  return (
    <Navigate
      replace
      to="login"
      state={auth.loggedOut ? undefined : { from: { pathname, search } }}
    />
  )
}

function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppLayout>
      <Suspense fallback={<AppLoading />}>{children}</Suspense>
    </AppLayout>
  )
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
