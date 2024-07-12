import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  GetUserCanAccessResourcesQuery,
  GetUserCanAccessResourcesQueryVariables,
} from '@app/generated/graphql'
import { GET_USER_CAN_ACCESS_RESOURCES } from '@app/modules/certifications/hooks/get-user-can-access-resources'
import { CourseEvaluation } from '@app/modules/course_details/course_evaluation_tab/pages/ExternalEvaluationSummary/components/CourseEvaluation'
import { CourseHealthAndSafetyForm } from '@app/modules/course_details/course_evaluation_tab/pages/ExternalEvaluationSummary/components/CourseHealthAndSafetyForm'
import { EvaluationSummary } from '@app/modules/course_details/course_evaluation_tab/pages/InternalEvaluationSummary'
import { CourseCertificationDetails } from '@app/modules/course_details/pages/CourseCertificationDetails/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/modules/course_details/pages/CourseDetails'
import { CourseDetails } from '@app/modules/course_details/pages/UserPagesCourseDetails/CourseDetails'
import { OrganisationRoutes } from '@app/modules/organisation/routes'
import { ManageCourses } from '@app/pages/admin/components/Courses/ManageCourses'
import { NotFound } from '@app/pages/common/NotFound'
import { ChooseTransferCourse } from '@app/pages/TransferParticipant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/pages/TransferParticipant/components/TransferDetails'
import { TransferReview } from '@app/pages/TransferParticipant/components/TransferReview'
import { UserTransferParticipant } from '@app/pages/TransferParticipant/UserTransferParticipant'
import { AcceptInvite } from '@app/pages/user-pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/pages/user-pages/AcceptOrgInvite'
import { AttendeeCourses } from '@app/pages/user-pages/MyCourses'

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
    (data?.certificates.aggregate?.count ??
      0 + (data?.participant.aggregate?.count ?? 0)) > 0 || acl.isOrgAdmin()

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
