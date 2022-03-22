import React from 'react'
import { Outlet } from 'react-router-dom'

export const TrainerBasePage = () => {
  // TODO: redirect if not allowed

  return (
    <div data-testid="trainer-base-wrap">
      <Outlet />
    </div>
  )
}
