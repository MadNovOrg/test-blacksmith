import { Contacts } from '@mui/icons-material'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AcceptInvite } from '@app/modules/accept_invite/pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/modules/accept_org_invite/pages/AcceptOrgInvite'
import { ArloConnect, ArloImport } from '@app/modules/admin/Arlo/pages'
import { AuditsPage } from '@app/modules/admin/Audits/pages/AuditsPage'
import { CourseExceptionsLog } from '@app/modules/admin/CourseExceptionsLog/pages/CourseExceptionsLog'
import {
  DiscountsList,
  DiscountForm,
} from '@app/modules/admin/Discounts/components'
import { AdminPage } from '@app/modules/admin/pages/AdminPage'
import { PricingRoutes } from '@app/modules/admin/Pricing'
import { XeroConnect } from '@app/modules/admin/Xero/pages'
import { CertificationsRoutes } from '@app/modules/certifications/routes'
import { CourseBuilder } from '@app/modules/course/pages/CourseBuilder/CourseBuilder'
import { CreateCourse } from '@app/modules/course/pages/CreateCourse'
import { AssignTrainers } from '@app/modules/course/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/modules/course/pages/CreateCourse/components/CreateCourseForm'
import { LicenseOrderDetails } from '@app/modules/course/pages/CreateCourse/components/LicenseOrderDetails'
import { OrderDetails as CourseOrderDetails } from '@app/modules/course/pages/CreateCourse/components/OrderDetails'
import { ReviewAndConfirm } from '@app/modules/course/pages/CreateCourse/components/ReviewAndConfirm'
import { ReviewLicenseOrder } from '@app/modules/course/pages/CreateCourse/components/ReviewLicenseOrder'
import { TrainerExpenses } from '@app/modules/course/pages/CreateCourse/components/TrainerExpenses'
import { ManageCourses } from '@app/modules/course/pages/ManageCourses/ManageCourses'
import { CourseEvaluation } from '@app/modules/course_details/course_evaluation_tab/pages/ExternalEvaluationSummary/components/CourseEvaluation'
import { EvaluationSummary } from '@app/modules/course_details/course_evaluation_tab/pages/InternalEvaluationSummary'
import { CourseCertificationDetails } from '@app/modules/course_details/pages/CourseCertificationDetails/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/modules/course_details/pages/CourseDetails'
import { EditCourse } from '@app/modules/edit_course/pages/EditCourse'
import { GradingRoutes } from '@app/modules/grading/routes'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import { OrderDetails } from '@app/modules/order_details/pages/OrderDetails'
import { Orders } from '@app/modules/orders/pages/Orders'
import { OrganisationRoutes } from '@app/modules/organisation/routes'
import { TrainerCourses } from '@app/modules/trainer_courses/pages/MyCourses'
import { TrainerFeedback } from '@app/modules/trainer_feedback/pages/TrainerFeedback'
import { ChooseTransferCourse } from '@app/modules/transfer_participant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/modules/transfer_participant/components/TransferDetails'
import { TransferReview } from '@app/modules/transfer_participant/components/TransferReview'
import { AdminTransferParticipantPage } from '@app/modules/transfer_participant/pages/AdminTransferParticipant/AdminTransferParticipant'
import { UserRoutes } from '@app/modules/user/routes'

const ResourcesRoutes = React.lazy(() => import('./resources'))

const TTAdminRoutes = () => {
  const { acl } = useAuth()

  return (
    <Routes>
      <Route index element={<Navigate replace to="manage-courses" />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="accept-org-invite/:id" element={<AcceptOrgInvite />} />

      <Route path="courses">
        <Route index element={<TrainerCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
          <Route path="trainer-expenses" element={<TrainerExpenses />} />
          <Route path="order-details" element={<CourseOrderDetails />} />
          <Route path="review-and-confirm" element={<ReviewAndConfirm />} />
          <Route
            path="license-order-details"
            element={<LicenseOrderDetails />}
          />
          <Route path="review-license-order" element={<ReviewLicenseOrder />} />
        </Route>

        <Route path="edit/:id" element={<EditCourse />} />

        <Route path=":id">
          <Route path="modules" element={<CourseBuilder />} />
          <Route path="details" element={<TrainerCourseDetails />} />
          <Route path="grading/*" element={<GradingRoutes />} />
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
              <Route path="modules" element={<CourseBuilder />} />
              <Route path="details" element={<TrainerCourseDetails />} />
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
            </Route>
          </Route>
        </Route>
      ) : null}

      {acl.canViewOrganizations() ? (
        <Route path="organisations/*" element={<OrganisationRoutes />} />
      ) : null}

      <Route path="certifications" element={<CertificationsRoutes />} />

      <Route path="orders">
        <Route index element={<Orders />} />

        <Route path=":id" element={<OrderDetails />} />
      </Route>

      {acl.canViewAdmin() ? (
        <Route path="admin">
          <Route index element={<AdminPage />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="users/*" element={<UserRoutes />} />

          <Route path="pricing" element={<PricingRoutes />} />

          {acl.canViewAdminDiscount() ? (
            <Route path="discounts">
              <Route index element={<DiscountsList />} />
              <Route path="new" element={<DiscountForm />} />
              <Route path="edit/:id" element={<DiscountForm />} />
            </Route>
          ) : null}

          {acl.canViewXeroConnect() ? (
            <Route path="xero">
              <Route index element={<Navigate replace to="connect" />} />
              <Route path="connect" element={<XeroConnect />} />
            </Route>
          ) : null}

          {acl.canViewArloConnect() ? (
            <Route path="arlo">
              <Route index element={<Navigate replace to="connect" />} />
              <Route path="connect" element={<ArloConnect />} />
              <Route path="import" element={<ArloImport />} />
            </Route>
          ) : null}

          <Route
            path="course-exceptions-log"
            element={<CourseExceptionsLog />}
          />
          <Route path="audit" element={<AuditsPage />} />
        </Route>
      ) : null}

      <Route path="resources/*" element={<ResourcesRoutes />} />
      <Route path="accept-invite/:id" element={<AcceptInvite />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TTAdminRoutes
