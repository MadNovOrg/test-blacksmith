import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
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
import { CourseEvaluation } from '@app/modules/course_evaluation/pages/ExternalEvaluationSummary/components/CourseEvaluation'
import { EvaluationSummary } from '@app/modules/course_evaluation/pages/InternalEvaluationSummary'
import { GradingRoutes } from '@app/modules/grading/routes'
import { OrganisationRoutes } from '@app/modules/organisation/routes'
import { UserRoutes } from '@app/modules/user/routes'
import { AdminPage } from '@app/pages/admin'
import { AuditsPage } from '@app/pages/admin/Audits'
import { ManageCourses } from '@app/pages/admin/components/Courses/ManageCourses'
import { Contacts } from '@app/pages/admin/Contacts'
import { CourseExceptionsLog } from '@app/pages/admin/CourseExceptionsLog'
import { NotFound } from '@app/pages/common/NotFound'
import { EditCourse } from '@app/pages/EditCourse'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { TrainerCourses } from '@app/pages/trainer-pages/MyCourses'
import { TrainerFeedback } from '@app/pages/trainer-pages/TrainerFeedback'
import { AdminTransferParticipantPage } from '@app/pages/TransferParticipant/AdminTransferParticipant'
import { ChooseTransferCourse } from '@app/pages/TransferParticipant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/pages/TransferParticipant/components/TransferDetails'
import { TransferReview } from '@app/pages/TransferParticipant/components/TransferReview'
import { ArloConnect, ArloImport } from '@app/pages/tt-pages/Arlo'
import { DiscountForm, DiscountsList } from '@app/pages/tt-pages/Discounts'
import { OrderDetails } from '@app/pages/tt-pages/OrderDetails'
import { Orders } from '@app/pages/tt-pages/Orders'
import { PricingList } from '@app/pages/tt-pages/Pricing'
import { XeroConnect } from '@app/pages/tt-pages/Xero'
import { AcceptInvite } from '@app/pages/user-pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/pages/user-pages/AcceptOrgInvite'

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

          {acl.canViewAdminPricing() ? (
            <Route path="pricing">
              <Route index element={<PricingList />} />
            </Route>
          ) : null}

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
