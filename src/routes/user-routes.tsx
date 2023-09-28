import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import useSWR from 'swr'

import { useAuth } from '@app/context/auth'
import {
  GetUserCanAccessResourcesQuery,
  GetUserCanAccessResourcesQueryVariables,
} from '@app/generated/graphql'
import { AvailableCourses } from '@app/pages/admin/components/Courses/AvailableCourses'
import { ManageCourses } from '@app/pages/admin/components/Courses/ManageCourses'
import Organizations from '@app/pages/admin/components/Organizations'
import { EditOrgDetails } from '@app/pages/admin/components/Organizations/EditOrgDetails'
import { InviteUserToOrganization } from '@app/pages/admin/components/Organizations/InviteUserToOrganization/InviteUserToOrganization'
import { OrgDashboard } from '@app/pages/admin/components/Organizations/OrgDashboard'
import { NotFound } from '@app/pages/common/NotFound'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { EvaluationSummary } from '@app/pages/trainer-pages/EvaluationSummary'
import { ChooseTransferCourse } from '@app/pages/TransferParticipant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/pages/TransferParticipant/components/TransferDetails'
import { TransferReview } from '@app/pages/TransferParticipant/components/TransferReview'
import { UserTransferParticipant } from '@app/pages/TransferParticipant/UserTransferParticipant'
import { AcceptInvite } from '@app/pages/user-pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/pages/user-pages/AcceptOrgInvite'
import { CourseDetails } from '@app/pages/user-pages/CourseDetails'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'
import { CourseHealthAndSafetyForm } from '@app/pages/user-pages/CourseHealthAndSafetyForm'
import { AttendeeCourses } from '@app/pages/user-pages/MyCourses'
import { GET_USER_CAN_ACCESS_RESOURCES } from '@app/queries/certificate/get-user-can-access-resources'

const ResourcesRoutes = React.lazy(() => import('./resources'))

const UserRoutes = () => {
  const { acl, profile } = useAuth()

  const { data } = useSWR<
    GetUserCanAccessResourcesQuery,
    Error,
    [string, GetUserCanAccessResourcesQueryVariables]
  >([GET_USER_CAN_ACCESS_RESOURCES, { profileId: profile?.id }])

  const showResources =
    (data?.certificates.aggregate?.count ||
      0 + (data?.participant.aggregate?.count || 0)) > 0 || acl.isOrgAdmin()

  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="courses">
        <Route index element={<AttendeeCourses />} />

        <Route path=":id">
          <Route path="details" element={<CourseDetails />} />
          <Route path="evaluation" element={<CourseEvaluation />} />
          <Route
            path="health-and-safety"
            element={<CourseHealthAndSafetyForm />}
          />
          <Route path="transfer" element={<UserTransferParticipant />}>
            <Route index element={<ChooseTransferCourse />} />
            <Route path="details" element={<TransferDetails />} />
            <Route path="review" element={<TransferReview />} />
          </Route>
        </Route>
      </Route>

      {acl.canManageOrgCourses() ? (
        <Route path="manage-courses">
          <Route index element={<Navigate replace to="all" />} />
          <Route path=":orgId">
            <Route index element={<ManageCourses />} />
            <Route path=":id">
              <Route path="details" element={<TrainerCourseDetails />} />
              <Route path="evaluation">
                <Route path="view" element={<CourseEvaluation />} />
                <Route path="summary" element={<EvaluationSummary />} />
              </Route>

              <Route
                path="transfer/:participantId"
                element={<UserTransferParticipant />}
              >
                <Route index element={<ChooseTransferCourse />} />
                <Route path="details" element={<TransferDetails />} />
                <Route path="review" element={<TransferReview />} />
              </Route>
            </Route>
          </Route>
        </Route>
      ) : null}

      {acl.isBookingContact() ? (
        <Route path="manage-courses">
          <Route index element={<ManageCourses />} />
          <Route
            path=":id/details"
            element={<CourseDetails bookingOnly={true} />}
          />
        </Route>
      ) : null}

      {acl.isOrgKeyContact() ? (
        <Route path="manage-courses">
          <Route index element={<ManageCourses />} />
          <Route
            path=":id/details"
            element={<CourseDetails bookingOnly={true} />}
          />
        </Route>
      ) : null}

      <Route path="accept-invite/:id" element={<AcceptInvite />} />
      <Route path="accept-org-invite/:id" element={<AcceptOrgInvite />} />

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

      {showResources ? (
        <Route path="resources/*" element={<ResourcesRoutes />} />
      ) : null}

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default UserRoutes
