import { Contacts } from '@mui/icons-material'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AcceptInvite } from '@app/modules/accept_invite/pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/modules/accept_org_invite/pages/AcceptOrgInvite'
import { AuditsPage } from '@app/modules/admin/Audits/pages/AuditsPage'
import {
  DiscountsList,
  DiscountForm,
} from '@app/modules/admin/Discounts/components'
import { AdminPage } from '@app/modules/admin/pages/AdminPage'
import { CertificationsRoutes } from '@app/modules/certifications/routes'
import { OrderDetails as CourseOrderDetails } from '@app/modules/course/pages/CreateCourse/components/OrderDetails'
import { ManageCourses } from '@app/modules/course/pages/ManageCourses/ManageCourses'
import { CourseEvaluation } from '@app/modules/course_details/course_evaluation_tab/pages/ExternalEvaluationSummary/components/CourseEvaluation'
import { EvaluationSummary } from '@app/modules/course_details/course_evaluation_tab/pages/InternalEvaluationSummary'
import { CourseCertificationDetails } from '@app/modules/course_details/pages/CourseCertificationDetails/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/modules/course_details/pages/CourseDetails'
import { EditCourseWithContext } from '@app/modules/edit_course/contexts/EditCourseProvider'
import { ReviewLicensesOrder } from '@app/modules/edit_course/pages/ReviewLicensesOrder'
import { ParticipantGrade } from '@app/modules/grading/pages/ParticipantGrade/ParticipantGrade'
import { OrderDetails } from '@app/modules/order_details/pages/OrderDetails'
import { Orders } from '@app/modules/orders/pages/Orders'
import { OrganisationRoutes } from '@app/modules/organisation/routes'
import { TrainerFeedback } from '@app/modules/trainer_feedback/pages/TrainerFeedback'
import { ChooseTransferCourse } from '@app/modules/transfer_participant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/modules/transfer_participant/components/TransferDetails'
import { TransferReview as ANZTransferReview } from '@app/modules/transfer_participant/components/TransferReview/ANZ'
import { TransferReview as UKTransferReview } from '@app/modules/transfer_participant/components/TransferReview/UK'
import { AdminTransferParticipantPage } from '@app/modules/transfer_participant/pages/AdminTransferParticipant/AdminTransferParticipant'
import { UserRoutes } from '@app/modules/user/routes'

const NotFound = React.lazy(() =>
  import('@app/modules/not_found/pages/NotFound').then(module => ({
    default: module.NotFound,
  })),
)

const CreateCourse = React.lazy(() =>
  import('@app/modules/course/pages/CreateCourse').then(module => ({
    default: module.CreateCourse,
  })),
)

const AssignTrainers = React.lazy(() =>
  import(
    '@app/modules/course/pages/CreateCourse/components/AssignTrainers'
  ).then(module => ({
    default: module.AssignTrainers,
  })),
)

const TrainerExpenses = React.lazy(() =>
  import(
    '@app/modules/course/pages/CreateCourse/components/TrainerExpenses'
  ).then(module => ({
    default: module.TrainerExpenses,
  })),
)

const ReviewAndConfirm = React.lazy(() =>
  import(
    '@app/modules/course/pages/CreateCourse/components/ReviewAndConfirm'
  ).then(module => ({
    default: module.ReviewAndConfirm,
  })),
)

const CreateCourseForm = React.lazy(() =>
  import(
    '@app/modules/course/pages/CreateCourse/components/CreateCourseForm'
  ).then(module => ({
    default: module.CreateCourseForm,
  })),
)

const EditCourse = React.lazy(() =>
  import('@app/modules/edit_course/pages/EditCourse').then(module => ({
    default: module.EditCourse,
  })),
)

const MyCourses = React.lazy(() =>
  import('@app/modules/trainer_courses/pages/MyCourses').then(module => ({
    default: module.TrainerCourses,
  })),
)

const CourseExceptionsLog = React.lazy(() =>
  import(
    '@app/modules/admin/CourseExceptionsLog/pages/CourseExceptionsLog'
  ).then(module => ({
    default: module.CourseExceptionsLog,
  })),
)

const ResourcesRoutes = React.lazy(() => import('./resources'))

const SalesAdminRoutes = () => {
  const { acl } = useAuth()

  return (
    <Routes>
      <Route index element={<Navigate replace to="manage-courses" />} />

      <Route path="accept-org-invite/:id" element={<AcceptOrgInvite />} />

      <Route path="manage-courses">
        <Route index element={<Navigate replace to="all" />} />
        <Route path=":orgId">
          <Route index element={<ManageCourses />} />
          <Route path=":id">
            <Route path="details" element={<TrainerCourseDetails />} />
            <Route path="evaluation">
              <Route path="submit" element={<TrainerFeedback />} />
              <Route path="view" element={<CourseEvaluation />} />
              <Route path="summary" element={<EvaluationSummary />} />
            </Route>
            <Route
              path="transfer/:participantId"
              element={<AdminTransferParticipantPage />}
            >
              <Route index element={<ChooseTransferCourse />} />
              <Route path="details" element={<TransferDetails />} />
              <Route
                path="review"
                element={
                  acl.isUK() ? <UKTransferReview /> : <ANZTransferReview />
                }
              />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
          <Route path="trainer-expenses" element={<TrainerExpenses />} />
          <Route path="order-details" element={<CourseOrderDetails />} />
          <Route path="review-and-confirm" element={<ReviewAndConfirm />} />
        </Route>

        <Route path="edit/:id" element={<EditCourseWithContext />}>
          <Route index element={<EditCourse />} />
          <Route
            path="review-licenses-order"
            element={<ReviewLicensesOrder />}
          />
        </Route>

        <Route path=":id">
          <Route index element={<Navigate replace to="details" />} />
          <Route path="details" element={<TrainerCourseDetails />} />
          <Route path="grading/:participantId" element={<ParticipantGrade />} />
          <Route
            path="transfer/:participantId"
            element={<AdminTransferParticipantPage />}
          >
            <Route index element={<ChooseTransferCourse />} />
            <Route path="details" element={<TransferDetails />} />
            <Route
              path="review"
              element={
                acl.isUK() ? <UKTransferReview /> : <ANZTransferReview />
              }
            />
          </Route>
        </Route>
      </Route>

      {acl.canViewOrganizations() ? (
        <Route path="organisations/*" element={<OrganisationRoutes />} />
      ) : null}

      <Route path="resources/*" element={<ResourcesRoutes />} />

      <Route path="certifications" element={<CertificationsRoutes />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="orders">
        <Route index element={<Orders />} />

        <Route path=":id" element={<OrderDetails />} />
      </Route>

      {acl.canViewAdmin() ? (
        <Route path="admin">
          <Route index element={<AdminPage />} />
          <Route path="contacts" element={<Contacts />} />
          <Route
            path="course-exceptions-log"
            element={<CourseExceptionsLog />}
          />
          <Route path="users/*" element={<UserRoutes />} />
          {acl.canViewAdminDiscount() ? (
            <Route path="discounts">
              <Route index element={<DiscountsList />} />
              <Route path="new" element={<DiscountForm />} />
              <Route path="edit/:id" element={<DiscountForm />} />
            </Route>
          ) : null}

          <Route path="audit" element={<AuditsPage />} />
        </Route>
      ) : null}

      <Route path="accept-invite/:id" element={<AcceptInvite />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default SalesAdminRoutes
