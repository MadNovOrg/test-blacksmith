import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { UnverifiedLayout } from '@app/layouts/UnverifiedLayout'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import { AutoVerify } from '@app/modules/profile/pages/AutoVerify'
import { VerifyEmailPage } from '@app/modules/verify_email/pages/VerifyEmail'

// Routes that are specific to unverified users are rendered here.
// Booking and Profile pages are applicable to any logged in user
// hence they belong in routes/index.tsx
const UnverifiedRoutes = () => {
  return (
    <UnverifiedLayout>
      <Suspense fallback={<SuspenseLoading />}>
        <Routes>
          <Route index element={<Navigate replace to="verify" />} />
          <Route path="accept-invite/:id" element={<AutoVerify />} />
          <Route path="accept-org-invite/:id" element={<AutoVerify />} />
          <Route path="verify" element={<VerifyEmailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </UnverifiedLayout>
  )
}

export default UnverifiedRoutes
