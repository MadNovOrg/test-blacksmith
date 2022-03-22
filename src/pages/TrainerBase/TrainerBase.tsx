import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

export const TrainerBasePage = () => {
  const { acl } = useAuth()

  // IMPROVEMENT: Extract to reusable component
  if (!acl.canViewTrainerBase()) {
    return <Navigate to="/my-training" />
  }

  return (
    <div data-testid="trainer-base-wrap">
      <Outlet />
    </div>
  )
}
