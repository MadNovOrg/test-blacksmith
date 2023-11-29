import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AvailableCourses } from '@app/pages/admin/components/Courses/AvailableCourses'
import { ManageCourses } from '@app/pages/admin/components/Courses/ManageCourses'
import Organizations from '@app/pages/admin/components/Organizations'
import { EditOrgDetails } from '@app/pages/admin/components/Organizations/EditOrgDetails'
import { InviteUserToOrganization } from '@app/pages/admin/components/Organizations/InviteUserToOrganization/InviteUserToOrganization'
import { OrgDashboard } from '@app/pages/admin/components/Organizations/OrgDashboard'
import { NotFound } from '@app/pages/common/NotFound'
import { CourseBuilder } from '@app/pages/CourseBuilder/CourseBuilder'
import { CreateCourse } from '@app/pages/CreateCourse'
import { AssignTrainers } from '@app/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/CreateCourse/components/CreateCourseForm'
import { LicenseOrderDetails } from '@app/pages/CreateCourse/components/LicenseOrderDetails'
import { ReviewLicenseOrder } from '@app/pages/CreateCourse/components/ReviewLicenseOrder'
import { EditCourse } from '@app/pages/EditCourse'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { CourseGrading } from '@app/pages/trainer-pages/CourseGrading'
import { ParticipantGrading } from '@app/pages/trainer-pages/CourseGrading/components/ParticipantGrading'
import { CourseGradingDetails } from '@app/pages/trainer-pages/CourseGradingDetails'
import { CourseAttendance } from '@app/pages/trainer-pages/CourseGradingDetails/CourseAttendance'
import { ModulesSelection } from '@app/pages/trainer-pages/CourseGradingDetails/ModulesSelection'
import { EvaluationSummary } from '@app/pages/trainer-pages/EvaluationSummary'
import { TrainerCourses } from '@app/pages/trainer-pages/MyCourses'
import { DraftCourses } from '@app/pages/trainer-pages/MyCourses/DraftCourses'
import { TrainerFeedback } from '@app/pages/trainer-pages/TrainerFeedback'
import { AdminTransferParticipantPage } from '@app/pages/TransferParticipant/AdminTransferParticipant'
import { ChooseTransferCourse } from '@app/pages/TransferParticipant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/pages/TransferParticipant/components/TransferDetails'
import { TransferReview } from '@app/pages/TransferParticipant/components/TransferReview'
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
          <Route path="grading" element={<CourseGrading />} />

          <Route
            path="grading/:participantId"
            element={<ParticipantGrading />}
          />

          <Route
            path="transfer/:participantId"
            element={<AdminTransferParticipantPage />}
          >
            <Route index element={<ChooseTransferCourse />} />
            <Route path="details" element={<TransferDetails />} />
            <Route path="review" element={<TransferReview />} />
          </Route>

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
        <Route path="organisations">
          <Route index element={<Navigate replace to="all" />} />
          <Route path="list" element={<Organizations />} />
          <Route path=":id">
            <Route index element={<OrgDashboard />} />
            <Route path="edit" element={<EditOrgDetails />} />
            {acl.canEditOrAddOrganizations() ? (
              <Route path="invite" element={<InviteUserToOrganization />} />
            ) : null}
            <Route path="courses" element={<AvailableCourses />} />
          </Route>
        </Route>
      ) : null}

      <Route path="resources/*" element={<ResourcesRoutes />} />

      <Route path="accept-invite/:id" element={<AcceptInvite />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TrainerBaseRoutes
