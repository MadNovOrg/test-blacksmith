import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { EditOrgDetails } from '@app/pages/admin/components/Organizations/EditOrgDetails'
import { InviteUserToOrganization } from '@app/pages/admin/components/Organizations/InviteUserToOrganization'
import { OrgDashboard } from '@app/pages/admin/components/Organizations/OrgDashboard'
import { NotFound } from '@app/pages/common/NotFound'
import { CreateCourse } from '@app/pages/CreateCourse'
import { AssignTrainers } from '@app/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/CreateCourse/components/CreateCourseForm'
import { EditCourse } from '@app/pages/EditCourse'
import { CourseBuilder } from '@app/pages/trainer-pages/CourseBuilder'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { CourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { CourseGrading } from '@app/pages/trainer-pages/CourseGrading'
import { ParticipantGrading } from '@app/pages/trainer-pages/CourseGrading/components/ParticipantGrading'
import { CourseGradingDetails } from '@app/pages/trainer-pages/CourseGradingDetails'
import { CourseAttendance } from '@app/pages/trainer-pages/CourseGradingDetails/CourseAttendance'
import { ModulesSelection } from '@app/pages/trainer-pages/CourseGradingDetails/ModulesSelection'
import { EvaluationSummary } from '@app/pages/trainer-pages/EvaluationSummary'
import { MyCourses } from '@app/pages/trainer-pages/MyCourses'
import { TrainerFeedback } from '@app/pages/trainer-pages/TrainerFeedback'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'

const MembershipRoutes = React.lazy(() => import('./membership'))

const TrainerBaseRoutes = () => {
  const { acl } = useAuth()

  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
        </Route>

        <Route path="edit/:id" element={<EditCourse />} />

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

          <Route path="grading-details" element={<CourseGradingDetails />}>
            <Route element={<CourseAttendance />} index />
            <Route path="modules" element={<ModulesSelection />} />
          </Route>
        </Route>
      </Route>

      {acl.canViewOrganizations() ? (
        <Route path="organizations">
          <Route index element={<Navigate replace to="all" />} />
          <Route path=":id">
            <Route index element={<OrgDashboard />} />
            <Route path="edit" element={<EditOrgDetails />} />
            <Route path="invite" element={<InviteUserToOrganization />} />
          </Route>
        </Route>
      ) : null}

      <Route path="membership/*" element={<MembershipRoutes />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TrainerBaseRoutes
