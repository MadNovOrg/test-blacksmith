import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  GetUserCanAccessResourcesQuery,
  GetUserCanAccessResourcesQueryVariables,
} from '@app/generated/graphql'
import { AcceptInvite } from '@app/modules/accept_invite/pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/modules/accept_org_invite/pages/AcceptOrgInvite'
import { GET_USER_CAN_ACCESS_RESOURCES } from '@app/modules/certifications/hooks/get-user-can-access-resources'
import { ManageCourses } from '@app/modules/course/pages/ManageCourses/ManageCourses'
import { CourseEvaluation } from '@app/modules/course_details/course_evaluation_tab/pages/ExternalEvaluationSummary/components/CourseEvaluation'
import { CourseHealthAndSafetyForm } from '@app/modules/course_details/course_evaluation_tab/pages/ExternalEvaluationSummary/components/CourseHealthAndSafetyForm'
import { EvaluationSummary } from '@app/modules/course_details/course_evaluation_tab/pages/InternalEvaluationSummary'
import { CourseCertificationDetails } from '@app/modules/course_details/pages/CourseCertificationDetails/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/modules/course_details/pages/CourseDetails'
import { CourseDetails } from '@app/modules/course_details/pages/UserPagesCourseDetails/CourseDetails'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import { OrganisationRoutes } from '@app/modules/organisation/routes'
import { ChooseTransferCourse } from '@app/modules/transfer_participant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/modules/transfer_participant/components/TransferDetails'
import { TransferReview } from '@app/modules/transfer_participant/components/TransferReview'
import { UserTransferParticipant } from '@app/modules/transfer_participant/pages/UserTransferParticipant/UserTransferParticipant'
import { AttendeeCourses } from '@app/modules/user_courses/pages/AttendeeCourses'

const ResourcesRoutes = React.lazy(() => import('./resources'))

const UserRoutes = () => {
  const { acl, profile } = useAuth()

  const [{ data }] = useQuery<
    GetUserCanAccessResourcesQuery,
    GetUserCanAccessResourcesQueryVariables
  >({
    query: GET_USER_CAN_ACCESS_RESOURCES,
    variables: { profileId: profile?.id },
  })

  const showResources =
    (data?.certificates.aggregate?.count ?? 0) +
      (data?.participant.aggregate?.count ?? 0) >
      0 || acl.isOrgAdmin()

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

      {acl.isBookingContact() || acl.isOrgKeyContact() ? (
        <Route path="manage-courses">
          <Route index element={<Navigate replace to="all" />} />

          <Route path=":orgId">
            <Route index element={<ManageCourses />} />

            <Route path=":id">
              <Route
                path="details"
                element={<CourseDetails bookingOnly={true} />}
              />
              <Route path="evaluation">
                <Route path="summary" element={<EvaluationSummary />} />
              </Route>

              {acl.isBookingContact() ? (
                <Route
                  path="transfer/:participantId"
                  element={<UserTransferParticipant />}
                >
                  <Route index element={<ChooseTransferCourse />} />
                  <Route path="details" element={<TransferDetails />} />
                  <Route path="review" element={<TransferReview />} />
                </Route>
              ) : null}
            </Route>
          </Route>
        </Route>
      ) : null}

      <Route path="accept-invite/:id" element={<AcceptInvite />} />
      <Route path="accept-org-invite/:id" element={<AcceptOrgInvite />} />

      {acl.canViewOrganizations() ? (
        <Route path="organisations/*" element={<OrganisationRoutes />} />
      ) : null}

      {showResources ? (
        <Route path="resources/*" element={<ResourcesRoutes />} />
      ) : null}

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default UserRoutes
