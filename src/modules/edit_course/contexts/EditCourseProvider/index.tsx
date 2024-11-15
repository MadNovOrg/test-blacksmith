import { Outlet } from 'react-router-dom'

import { EditCourseProvider } from './EditCourseProvider'

export const EditCourseWithContext = () => {
  return (
    <EditCourseProvider>
      <Outlet />
    </EditCourseProvider>
  )
}
