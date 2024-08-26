import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AcceptInvite } from '@app/modules/accept_invite/pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/modules/accept_org_invite/pages/AcceptOrgInvite'
import { CourseBuilder } from '@app/modules/course/pages/CourseBuilder/CourseBuilder'
import { CreateCourse } from '@app/modules/course/pages/CreateCourse'
import { AssignTrainers } from '@app/modules/course/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/modules/course/pages/CreateCourse/components/CreateCourseForm'
import { LicenseOrderDetails } from '@app/modules/course/pages/CreateCourse/components/LicenseOrderDetails'
import { ReviewLicenseOrder } from '@app/modules/course/pages/CreateCourse/components/ReviewLicenseOrder'
import { ManageCourses } from '@app/modules/course/pages/ManageCourses/ManageCourses'
import { TrainerCourseBuilder } from '@app/modules/course/pages/TrainerCourseBuilder/TrainerCourseBuilder'
import { CourseEvaluation } from '@app/modules/course_details/course_evaluation_tab/pages/ExternalEvaluationSummary/components/CourseEvaluation'
import { EvaluationSummary } from '@app/modules/course_details/course_evaluation_tab/pages/InternalEvaluationSummary'
import { CourseCertificationDetails } from '@app/modules/course_details/pages/CourseCertificationDetails/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/modules/course_details/pages/CourseDetails'
import { EditCourse } from '@app/modules/edit_course/pages/EditCourse'
import { GradingRoutes } from '@app/modules/grading/routes'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import { OrganisationRoutes } from '@app/modules/organisation/routes'
import { DraftCourses } from '@app/modules/trainer_courses/pages/DraftCourses/DraftCourses'
import { TrainerCourses } from '@app/modules/trainer_courses/pages/MyCourses'
import { TrainerFeedback } from '@app/modules/trainer_feedback/pages/TrainerFeedback'

const ResourcesRoutes = React.lazy(() => import('./resources'))

const TrainerBaseRoutes = () => {
  const { acl } = useAuth()

  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route path="accept-org-invite/:id" element={<AcceptOrgInvite />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="courses">
        <Route index element={<TrainerCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="modules" element={<TrainerCourseBuilder />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
          <Route
            path="license-order-details"
            element={<LicenseOrderDetails />}
          />
          <Route path="review-license-order" element={<ReviewLicenseOrder />} />
        </Route>

        <Route path="edit/:id" element={<EditCourse />} />

        <Route path=":id">
          <Route index element={<Navigate replace to="details" />} />
          <Route path="modules" element={<CourseBuilder />} />
          <Route path="details" element={<TrainerCourseDetails />} />
          <Route path="grading/*" element={<GradingRoutes />} />

          <Route path="evaluation">
            <Route path="submit" element={<TrainerFeedback />} />
            <Route path="view" element={<CourseEvaluation />} />
            <Route path="summary" element={<EvaluationSummary />} />
          </Route>
        </Route>
      </Route>

      <Route path="drafts">
        <Route index element={<DraftCourses />} />
        <Route path=":id" element={<CreateCourse />}>
          <Route path="modules" element={<TrainerCourseBuilder />} />
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
          <Route
            path="license-order-details"
            element={<LicenseOrderDetails />}
          />
          <Route path="review-license-order" element={<ReviewLicenseOrder />} />
        </Route>
      </Route>

      {acl.canManageOrgCourses() ? (
        <Route path="manage-courses">
          <Route index element={<Navigate replace to="all" />} />
          <Route path=":orgId">
            <Route index element={<ManageCourses />} />
            <Route path=":id/details" element={<TrainerCourseDetails />} />
          </Route>
        </Route>
      ) : null}

      {acl.canViewOrganizations() ? (
        <Route path="organisations/*" element={<OrganisationRoutes />} />
      ) : null}

      <Route path="resources/*" element={<ResourcesRoutes />} />

      <Route path="accept-invite/:id" element={<AcceptInvite />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TrainerBaseRoutes
