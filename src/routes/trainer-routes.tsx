import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { CourseBuilder } from '@app/modules/course/pages/CourseBuilder/CourseBuilder'
import { GradingRoutes } from '@app/modules/grading/routes'
import { OrganisationRoutes } from '@app/modules/organisation/routes'
import { ManageCourses } from '@app/pages/admin/components/Courses/ManageCourses'
import { NotFound } from '@app/pages/common/NotFound'
import { CreateCourse } from '@app/pages/CreateCourse'
import { AssignTrainers } from '@app/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/CreateCourse/components/CreateCourseForm'
import { LicenseOrderDetails } from '@app/pages/CreateCourse/components/LicenseOrderDetails'
import { ReviewLicenseOrder } from '@app/pages/CreateCourse/components/ReviewLicenseOrder'
import { EditCourse } from '@app/pages/EditCourse'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { EvaluationSummary } from '@app/pages/trainer-pages/EvaluationSummary'
import { TrainerCourses } from '@app/pages/trainer-pages/MyCourses'
import { DraftCourses } from '@app/pages/trainer-pages/MyCourses/DraftCourses'
import { TrainerFeedback } from '@app/pages/trainer-pages/TrainerFeedback'
import { AcceptInvite } from '@app/pages/user-pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/pages/user-pages/AcceptOrgInvite'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'

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
