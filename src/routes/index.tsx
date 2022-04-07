import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React, { Suspense, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { AppLayout } from '@app/components/AppLayout'
import { NotFound } from '@app/components/NotFound'
import { useAuth } from '@app/context/auth'
import { ContactedConfirmationPage } from '@app/pages/ContactedConfirmation'
import { ForgotPasswordPage } from '@app/pages/ForgotPassword'
import { InvitationPage } from '@app/pages/Invitation'
import { LoginPage } from '@app/pages/Login'
import { CourseEvaluation } from '@app/pages/MyTraining/CourseEvaluation'
import { ResetPasswordPage } from '@app/pages/ResetPassword'
import { SignUpPage } from '@app/pages/SignUp'
import { CourseBuilder } from '@app/pages/TrainerBase/components/Course/components/CourseBuilder'
import { MyCourses } from '@app/pages/TrainerBase/components/Course/components/MyCourses'
import { CourseDetails } from '@app/pages/TrainerBase/components/CourseDetails'
import { CourseGrading } from '@app/pages/TrainerBase/components/CourseGrading'
import { ParticipantGrading } from '@app/pages/TrainerBase/components/CourseGrading/components/ParticipantGrading'
import { CreateCourse } from '@app/pages/TrainerBase/components/CreateCourse'
import { AssignTrainers } from '@app/pages/TrainerBase/components/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/TrainerBase/components/CreateCourse/components/CreateCourseForm'
import { EvaluationSummary } from '@app/pages/TrainerBase/components/EvaluationSummary'
import { TrainerFeedback } from '@app/pages/TrainerBase/components/TrainerFeedback'
import { RoleName } from '@app/types'

const ProfileRoutes = React.lazy(() => import('./profile'))
const MyTrainingRoutes = React.lazy(() => import('./my-training'))
const MyOrgRoutes = React.lazy(() => import('./my-organization'))
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
  const { acl, activeRole } = useAuth()

  // TODO: may not need it
  const startPage = useMemo(() => {
    switch (activeRole ?? RoleName.USER) {
      case RoleName.USER:
        return '/courses'
      case RoleName.TRAINER:
        return '/courses'
      case RoleName.ORG_ADMIN:
        return '/courses'
      case RoleName.TT_OPS:
      case RoleName.TT_ADMIN:
        return '/courses'
      default:
        return '/profile'
    }
  }, [activeRole])

  const Root = useCallback(
    () => <Navigate replace to={startPage} />,
    [startPage]
  )

  return (
    <AppLayout>
      <Suspense fallback={<SuspenseLoading />}>
        <Routes>
          <Route index element={<Root />} />

          <Route path="profile/*" element={<ProfileRoutes />} />

          <Route path="/courses">
            <Route index element={<MyCourses />} />
            <Route path="new" element={<CreateCourse />}>
              <Route index element={<CreateCourseForm />} />
              <Route
                path="assign-trainers/:courseId"
                element={<AssignTrainers />}
              />
            </Route>

            <Route path=":id">
              <Route index element={<Navigate replace to="details" />} />
              <Route path="modules" element={<CourseBuilder />} />
              <Route path="details" element={<CourseDetails />} />
              <Route path="grading" element={<CourseGrading />} />
              <Route
                path="grading/:participantId"
                element={<ParticipantGrading />}
              />
              <Route path="evaluation">
                <Route path="submit" element={<TrainerFeedback />} />
                <Route path="view" element={<CourseEvaluation />} />
                <Route path="summary" element={<EvaluationSummary />} />
              </Route>
            </Route>
          </Route>

          <Route
            path="/my-training/*"
            element={acl.canViewMyTraining() ? <MyTrainingRoutes /> : <Root />}
          />

          <Route
            path="trainer-base/*"
            element={acl.canViewTrainerBase() ? <TrainerRoutes /> : <Root />}
          />

          <Route
            path="my-organization/*"
            element={acl.canViewMyOrganization() ? <MyOrgRoutes /> : <Root />}
          />

          <Route
            path="membership-area/*"
            element={acl.canViewMembership() ? <MembershipRoutes /> : <Root />}
          />

          <Route
            path="admin/*"
            element={acl.canViewAdmin() ? <AdminRoutes /> : <Root />}
          />

          <Route path="/login/*" element={<Root />} />
          <Route path="*" element={<NotFound />} />
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
