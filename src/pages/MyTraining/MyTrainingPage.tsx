import React from 'react'
import { Outlet } from 'react-router-dom'

type MyTrainingPageProps = unknown

export const MyTrainingPage: React.FC<MyTrainingPageProps> = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}
