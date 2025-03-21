import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React, { ReactNode, Suspense, useEffect, useMemo } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AppLayout } from '@app/layouts/AppLayout'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'
import { AutoLogin } from '@app/modules/autologin/pages/AutoLogin'
import { AutoRegisterPage } from '@app/modules/autoregister/pages/AutoRegister'
import { ChangePasswordPage } from '@app/modules/change_password/pages/ChangePassword'
import { ContactedConfirmationPage } from '@app/modules/contacted_information/pages/ContactedConfirmation'
import { CourseBookingDone } from '@app/modules/course_booking/components/CourseBookingDone'
import { CourseBookingPage } from '@app/modules/course_booking/pages/CourseBooking'
import { ForgotPasswordPage } from '@app/modules/forgot_password/pages/ForgotPassword'
import { InvitationPage } from '@app/modules/invitation/pages/Invitation'
import { OrgInvitationPage } from '@app/modules/invitation/pages/Invitation/OrgInvitation'
import { LoginPage } from '@app/modules/login/pages/Login'
import { LogoutPage } from '@app/modules/logout/pages/Logout'
import { Onboarding as ANZOnboarding } from '@app/modules/onboarding/pages/ANZ/Onboarding'
import { Onboarding as UKOnboarding } from '@app/modules/onboarding/pages/UK/Onboarding'
import { RegistrationPage } from '@app/modules/registration/pages/Registration'
import { ResetPasswordPage } from '@app/modules/reset_password/pages/ResetPassword'
import { WaitlistRoutes } from '@app/modules/waitlist/routes'
import { Welcome } from '@app/modules/welcome/pages/Welcome/Welcome'
import { RoleName } from '@app/types'

const UKProfileRoutes = React.lazy(
  () => import('../modules/profile/routes/UK/profile'),
)

const ANZProfileRoutes = React.lazy(
  () => import('../modules/profile/routes/ANZ/profile'),
)

const TrainerRoutes = React.lazy(() => import('./trainer-routes'))
const UserRoutes = React.lazy(() => import('./user-routes'))
const TTAdminRoutes = React.lazy(() => import('./tt-admin-routes'))
const UnverifiedRoutes = React.lazy(
  () => import('../modules/profile/routes/unverified-routes'),
)
const SalesAdminRoutes = React.lazy(() => import('./sales-admin-routes'))
const SalesRepresentativeRoute = React.lazy(
  () => import('./sales-representative-routes'),
)
const FinanceRoute = React.lazy(() => import('./finance-routes'))

const publicRoutesMap: Record<string, React.ElementType> = {
  '/invitation': InvitationPage,
  '/org-invitation': OrgInvitationPage,
  '/auto-login': AutoLogin,
  '/waitlist': WaitlistRoutes,
  '/waitlist-cancellation': WaitlistRoutes,
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
      <Route index element={<RedirectToLogin />} />
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

const doNotRedirectToOnboardingPathnames = [
  'accept-invite',
  'accept-org-invite',
]

function LoggedInRoutes() {
  const { activeRole, profile, acl } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isUKRegion = acl.isUK()

  /**
   * The pathname is used for redirect to invitations links,
   * being not authenticated and prevent home page redirect to
   * knowledgehub app
   */
  const redirectFromLogin =
    import.meta.env.MODE === 'production' &&
    Boolean(location.state?.from?.pathname && location.state?.from?.fromLogin)

  useEffect(() => {
    if (
      !doNotRedirectToOnboardingPathnames.some(path =>
        location.pathname.includes(path),
      ) &&
      (!profile?.givenName ||
        !profile.familyName ||
        !profile.phone ||
        !profile.dob)
    ) {
      navigate('onboarding')
    }
  }, [profile, navigate, location.pathname])

  if (!activeRole) return null

  const RouteComp = roleRoutesMap[activeRole]

  return (
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
            {isUKRegion ? <UKProfileRoutes /> : <ANZProfileRoutes />}
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
              {isUKRegion ? <UKOnboarding /> : <ANZOnboarding />}
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

      {!redirectFromLogin ? (
        <Route path="login/*" element={<Navigate replace to="/" />} />
      ) : null}

      <Route path="logout" element={<LogoutPage />} />
    </Routes>
  )
}

export function RedirectToLogin() {
  const { pathname, search, state } = useLocation()
  const auth = useAuth()

  const locationState = state as { email?: string } | null

  const params = new URLSearchParams(window.location.search)
  const requestedRole = params.get('role') as RoleName | null

  const useRole = useMemo(() => {
    if (!requestedRole) return undefined

    return Object.values(RoleName).includes(requestedRole)
      ? requestedRole
      : undefined
  }, [requestedRole])

  return (
    <Navigate
      replace
      to={`login${
        useRole ? '?' + new URLSearchParams('role=' + useRole).toString() : ''
      }`}
      state={
        auth.loggedOut && !auth.autoLoggedOut
          ? undefined
          : {
              ...(locationState?.email ? { email: locationState.email } : {}),
              from: {
                fromLogin: true,
                pathname,
                search,
              },
            }
      }
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
