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

import { GettingStartedDialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import { AppLayout } from '@app/layouts/AppLayout'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'
import { AutoLogin } from '@app/pages/common/AutoLogin'
import { AutoRegisterPage } from '@app/pages/common/AutoRegister'
import { ChangePasswordPage } from '@app/pages/common/ChangePassword'
import { CourseBookingPage } from '@app/pages/common/CourseBooking'
import { CourseBookingDone } from '@app/pages/common/CourseBooking/components/CourseBookingDone'
import { CourseWaitlist } from '@app/pages/common/CourseWaitlist'
import { CourseWaitlistCancellation } from '@app/pages/common/CourseWaitlistCancellation'
import { ForgotPasswordPage } from '@app/pages/common/ForgotPassword'
import { LoginPage } from '@app/pages/common/Login'
import { LogoutPage } from '@app/pages/common/Logout'
import { RegistrationPage } from '@app/pages/common/Registration'
import { ResetPasswordPage } from '@app/pages/common/ResetPassword'
import { ContactedConfirmationPage } from '@app/pages/ContactedConfirmation'
import options from '@app/pages/GettingStarted/options'
import { InvitationPage } from '@app/pages/Invitation'
import { OrgInvitationPage } from '@app/pages/Invitation/OrgInvitation'
import { Onboarding } from '@app/pages/Onboarding'
import { Welcome } from '@app/pages/Welcome'
import { RoleName } from '@app/types'

const ProfileRoutes = React.lazy(() => import('./profile'))
const TrainerRoutes = React.lazy(() => import('./trainer-routes'))
const UserRoutes = React.lazy(() => import('./user-routes'))
const TTAdminRoutes = React.lazy(() => import('./tt-admin-routes'))
const UnverifiedRoutes = React.lazy(() => import('./unverified-routes'))
const SalesAdminRoutes = React.lazy(() => import('./sales-admin-routes'))
const SalesRepresentativeRoute = React.lazy(
  () => import('./sales-representative-routes')
)
const FinanceRoute = React.lazy(() => import('./finance-routes'))

const publicRoutesMap: Record<string, React.ElementType> = {
  '/invitation': InvitationPage,
  '/org-invitation': OrgInvitationPage,
  '/auto-login': AutoLogin,
  '/waitlist': CourseWaitlist,
  '/waitlist-cancellation': CourseWaitlistCancellation,
  '/change-password': ChangePasswordPage,
} as const

const roleRoutesMap: Record<RoleName, React.ElementType> = {
  [RoleName.SALES_REPRESENTATIVE]: SalesRepresentativeRoute,
  [RoleName.SALES_ADMIN]: SalesAdminRoutes,
  [RoleName.FINANCE]: FinanceRoute,
  [RoleName.TRAINER]: TrainerRoutes,
  [RoleName.BOOKING_CONTACT]: UserRoutes,
  [RoleName.ORGANIZATION_KEY_CONTACT]: UserRoutes,
  [RoleName.USER]: UserRoutes,
  [RoleName.LD]: TTAdminRoutes,
  [RoleName.TT_OPS]: TTAdminRoutes,
  [RoleName.TT_ADMIN]: TTAdminRoutes,
  [RoleName.UNVERIFIED]: UnverifiedRoutes,
  [RoleName.ANONYMOUS]: UnverifiedRoutes,
} as const

export const AppRoutes = () => {
  const auth = useAuth()
  const { pathname } = useLocation()
  const PublicRoute = publicRoutesMap[pathname]

  if (PublicRoute) {
    return <PublicRoute />
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
      <Route path="logout" element={<LogoutPage />} />
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

  const [showGettingStartedDialog, setShowGettingStartedDialog] =
    useState(false) // initial state should be firstTimeLogin || longTimeSinceLastLogin

  useEffect(() => {
    if (
      !profile?.givenName ||
      !profile.familyName ||
      !profile.phone ||
      !profile.dob
    ) {
      navigate('onboarding')
    }
  }, [profile, navigate])

  if (!activeRole) return null

  const RouteComp = roleRoutesMap[activeRole]

  return (
    <>
      <GettingStartedDialog
        options={options}
        open={showGettingStartedDialog}
        onClose={() => setShowGettingStartedDialog(false)}
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
        <Route path="logout" element={<LogoutPage />} />
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
