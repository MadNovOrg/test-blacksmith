import React, { Suspense, useMemo } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { AppLayout } from '@app/components/AppLayout'

import { useAuth } from '@app/context/auth'

import { LoginPage } from '@app/pages/Login'
import { SignUpPage } from '@app/pages/SignUp'
import { InvitationPage } from '@app/pages/Invitation'
import { ForgotPasswordPage } from '@app/pages/ForgotPassword'
import { ResetPasswordPage } from '@app/pages/ResetPassword'
import { ContactedConfirmationPage } from '@app/pages/ContactedConfirmation'

const ProfileRoutes = React.lazy(() => import('./profile'))
const MyTrainingRoutes = React.lazy(() => import('./my-training'))
const MyOrgRoutes = React.lazy(() => import('./my-training'))
const MembershipRoutes = React.lazy(() => import('./membership'))
const TrainerRoutes = React.lazy(() => import('./trainer-base'))
const AdminRoutes = React.lazy(() => import('./admin'))

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
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="invitation" element={<InvitationPage />} />
      <Route
        path="contacted-confirmation"
        element={<ContactedConfirmationPage />}
      />
    </Routes>
  )
}

function LoggedInRoutes() {
  const { acl } = useAuth()

  const startPage = useMemo(() => {
    if (acl.canViewTrainerBase()) return 'trainer-base'
    return 'my-training'
  }, [acl])

  return (
    <AppLayout>
      <Suspense fallback={<SuspenseLoading />}>
        <Routes>
          <Route path="login" element={<Navigate replace to="/" />} />
          <Route index element={<Navigate replace to={startPage} />} />

          <Route path="my-profile/*" element={<ProfileRoutes />} />

          {acl.canViewMyTraining() ? (
            <Route path="my-training/*" element={<MyTrainingRoutes />} />
          ) : null}

          {acl.canViewTrainerBase() ? (
            <Route path="trainer-base/*" element={<TrainerRoutes />} />
          ) : null}

          {acl.canViewMyOrganization() ? (
            <Route path="my-organization/*" element={<MyOrgRoutes />} />
          ) : null}

          {acl.canViewMembership() ? (
            <Route path="membership-area/*" element={<MembershipRoutes />} />
          ) : null}

          {acl.canViewAdmin() ? (
            <Route path="admin/*" element={<AdminRoutes />} />
          ) : null}
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

function SuspenseLoading() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 5,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1" sx={{ mt: 2, fontSize: 12 }}>
        {t('components.suspense-loading.text')}
      </Typography>
    </Box>
  )
}
