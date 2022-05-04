import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { UnverifiedLayout } from '@app/components/UnverifiedLayout'
import { CourseBookingPage } from '@app/pages/common/CourseBooking'
import { NotFound } from '@app/pages/common/NotFound'
import { VerifyEmailPage } from '@app/pages/common/VerifyEmail'
const ProfileRoutes = React.lazy(() => import('./profile'))

const UnverifiedRoutes = () => {
  return (
    <UnverifiedLayout>
      <Suspense fallback={<SuspenseLoading />}>
        <Routes>
          <Route index element={<Navigate replace to="booking" />} />
          <Route path="verify" element={<VerifyEmailPage />} />
          <Route path="booking/*" element={<CourseBookingPage />} />
          <Route path="profile/*" element={<ProfileRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </UnverifiedLayout>
  )
}

export default UnverifiedRoutes
