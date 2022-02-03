import React from 'react'
import { Outlet } from 'react-router-dom'

type TrainerBasePageProps = unknown

export const TrainerBasePage: React.FC<TrainerBasePageProps> = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}
