import { Route, Routes } from 'react-router-dom'

import { CourseWaitlistCancellation } from './pages'
import { CourseWaitlist } from './pages/CourseWaitlist/CourseWaitlist'

export const WaitlistRoutes = () => {
  return (
    <Routes>
      <Route path="/waitlist" element={<CourseWaitlist />} />
      <Route
        path="/waitlist-cancellation"
        element={<CourseWaitlistCancellation />}
      />
    </Routes>
  )
}
