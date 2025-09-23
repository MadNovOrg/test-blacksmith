import { Routes, Route } from 'react-router-dom'

import { CourseGrading } from './pages/CourseGrading/CourseGrading'
import { CourseGradingDetails } from './pages/CourseGradingDetails/CourseGradingDetails'
import { CourseAttendance } from './pages/CourseGradingDetails/pages/CourseAttendance/CourseAttendance'
import { ModulesSelectionV2 } from './pages/CourseGradingDetails/pages/ModulesSelectionV2/ModulesSelectionV2'
import { ParticipantGrade } from './pages/ParticipantGrade/ParticipantGrade'

export const GradingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CourseGrading />} />
      <Route path=":participantId" element={<ParticipantGrade />} />
      <Route path="details" element={<CourseGradingDetails />}>
        <Route element={<CourseAttendance />} index />
        <Route path="modules" element={<ModulesSelectionV2 />} />
      </Route>
    </Routes>
  )
}
