import { Routes, Route } from 'react-router-dom'

import { CourseGrading } from './pages/CourseGrading/CourseGrading'
import { CourseGradingDetails } from './pages/CourseGradingDetails/CourseGradingDetails'
import { CourseAttendance } from './pages/CourseGradingDetails/pages/CourseAttendance/CourseAttendance'
import { ModulesSelection } from './pages/CourseGradingDetails/pages/ModulesSelection/ModulesSelection'
import { ParticipantGrading } from './pages/ParticipantGrading/ParticipantGrading'

export const GradingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CourseGrading />} />
      <Route path=":participantId" element={<ParticipantGrading />} />
      <Route path="details" element={<CourseGradingDetails />}>
        <Route element={<CourseAttendance />} index />
        <Route path="modules" element={<ModulesSelection />} />
      </Route>
    </Routes>
  )
}
