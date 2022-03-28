import React from 'react'
import { Outlet } from 'react-router-dom'

export const TrainerBasePage = () => {
  return (
    <div data-testid="trainer-base-wrap">
      <Outlet />
    </div>
  )
}
