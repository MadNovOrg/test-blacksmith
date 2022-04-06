import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { NotFound } from '@app/components/NotFound'
import { CourseEvaluation } from '@app/pages/MyTraining/CourseEvaluation'
import { TrainerBasePage } from '@app/pages/TrainerBase'
import { Course } from '@app/pages/TrainerBase/components/Course'
import { CourseBuilder } from '@app/pages/TrainerBase/components/Course/components/CourseBuilder'
import { MyCourses } from '@app/pages/TrainerBase/components/Course/components/MyCourses'
import { CourseDetails } from '@app/pages/TrainerBase/components/CourseDetails'
import { CourseGrading } from '@app/pages/TrainerBase/components/CourseGrading'
import { ParticipantGrading } from '@app/pages/TrainerBase/components/CourseGrading/components/ParticipantGrading'
import { CourseGradingDetails } from '@app/pages/TrainerBase/components/CourseGradingDetails'
import { CourseAttendance } from '@app/pages/TrainerBase/components/CourseGradingDetails/CourseAttendance'
import { ModulesSelection } from '@app/pages/TrainerBase/components/CourseGradingDetails/ModulesSelection'
import { CreateCourse } from '@app/pages/TrainerBase/components/CreateCourse'
import { AssignTrainers } from '@app/pages/TrainerBase/components/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/TrainerBase/components/CreateCourse/components/CreateCourseForm'
import { EvaluationSummary } from '@app/pages/TrainerBase/components/EvaluationSummary'
import { Management as TrainerManagement } from '@app/pages/TrainerBase/components/Management'
import { ManageAvailability as TrainerAvailability } from '@app/pages/TrainerBase/components/Management/components/ManageAvailability'
import { ManageExpenses as TrainerExpenses } from '@app/pages/TrainerBase/components/Management/components/ManageExpenses'
import { MyCalendar as TrainerCalendar } from '@app/pages/TrainerBase/components/Management/components/MyCalendar'
import { TrainerDashboard } from '@app/pages/TrainerBase/components/TrainerDashboard'
import { TrainerFeedback } from '@app/pages/TrainerBase/components/TrainerFeedback'

const TrainerBaseRoutes = () => {
  return (
    <Routes>
      <Route element={<TrainerBasePage />}>
        <Route index element={<TrainerDashboard />} />
        <Route path="course" element={<Course />}>
          <Route path="new" element={<CreateCourse />}>
            <Route index element={<CreateCourseForm />} />
            <Route
              path="assign-trainers/:courseId"
              element={<AssignTrainers />}
            />
          </Route>
          <Route index element={<MyCourses />} />
          <Route path=":id">
            <Route index element={<Navigate replace to="details" />} />
            <Route path="modules" element={<CourseBuilder />} />
            <Route path="details" element={<CourseDetails />} />
            <Route path="grading" element={<CourseGrading />} />
            <Route
              path="grading/:participantId"
              element={<ParticipantGrading />}
            />
            <Route path="evaluation">
              <Route path="submit" element={<TrainerFeedback />} />
              <Route path="view" element={<CourseEvaluation />} />
              <Route path="summary" element={<EvaluationSummary />} />
            </Route>
          </Route>
          <Route path=":id/grading-details" element={<CourseGradingDetails />}>
            <Route element={<CourseAttendance />} index />
            <Route path="modules" element={<ModulesSelection />} />
          </Route>
        </Route>
        <Route path="management" element={<TrainerManagement />}>
          <Route index element={<Navigate replace to="calendar" />} />
          <Route path="calendar" element={<TrainerCalendar />} />
          <Route path="availability" element={<TrainerAvailability />} />
          <Route path="expenses" element={<TrainerExpenses />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TrainerBaseRoutes
