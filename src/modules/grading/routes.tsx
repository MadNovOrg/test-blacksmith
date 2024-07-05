import { useFeatureFlagEnabled } from 'posthog-js/react'
import { Routes, Route } from 'react-router-dom'

import { CourseGrading } from './pages/CourseGrading/CourseGrading'
import { CourseGradingDetails } from './pages/CourseGradingDetails/CourseGradingDetails'
import { CourseAttendance } from './pages/CourseGradingDetails/pages/CourseAttendance/CourseAttendance'
import { ModulesSelection } from './pages/CourseGradingDetails/pages/ModulesSelection/ModulesSelection'
import { ModulesSelectionV2 } from './pages/CourseGradingDetails/pages/ModulesSelectionV2/ModulesSelectionV2'
import { ParticipantGrade } from './pages/ParticipantGrade/ParticipantGrade'

export const GradingRoutes: React.FC = () => {
  const newModulesDataModelEnabled = useFeatureFlagEnabled(
    'new-modules-data-model',
  )

  return (
    <Routes>
      <Route index element={<CourseGrading />} />
      <Route path=":participantId" element={<ParticipantGrade />} />
      <Route path="details" element={<CourseGradingDetails />}>
        <Route element={<CourseAttendance />} index />
        <Route
          path="modules"
          element={
            newModulesDataModelEnabled ? (
              <ModulesSelectionV2 />
            ) : (
              <ModulesSelection />
            )
          }
        />
      </Route>
    </Routes>
  )
}
