import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AdminPage } from '@app/pages/admin'
import { AuditsPage } from '@app/pages/admin/Audits'
import { AvailableCourses } from '@app/pages/admin/components/Courses/AvailableCourses'
import { ManageCourses } from '@app/pages/admin/components/Courses/ManageCourses'
import Organizations from '@app/pages/admin/components/Organizations'
import { CreateOrganization } from '@app/pages/admin/components/Organizations/CreateOrganization'
import { EditOrgDetails } from '@app/pages/admin/components/Organizations/EditOrgDetails'
import { InviteUserToOrganization } from '@app/pages/admin/components/Organizations/InviteUserToOrganization'
import { OrgDashboard } from '@app/pages/admin/components/Organizations/OrgDashboard'
import { Contacts } from '@app/pages/admin/Contacts'
import { CourseExceptionsLog } from '@app/pages/admin/CourseExceptionsLog'
import { Users } from '@app/pages/admin/Users'
import { NotFound } from '@app/pages/common/NotFound'
import { CreateCourse } from '@app/pages/CreateCourse'
import { AssignTrainers } from '@app/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/CreateCourse/components/CreateCourseForm'
import { LicenseOrderDetails } from '@app/pages/CreateCourse/components/LicenseOrderDetails'
import { OrderDetails as CourseOrderDetails } from '@app/pages/CreateCourse/components/OrderDetails'
import { ReviewAndConfirm } from '@app/pages/CreateCourse/components/ReviewAndConfirm'
import { ReviewLicenseOrder } from '@app/pages/CreateCourse/components/ReviewLicenseOrder'
import { TrainerExpenses } from '@app/pages/CreateCourse/components/TrainerExpenses'
import { EditCourse } from '@app/pages/EditCourse'
import { CourseBuilderCommon } from '@app/pages/trainer-pages/CourseBuilderCommon'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { CourseGrading } from '@app/pages/trainer-pages/CourseGrading'
import { ParticipantGrading } from '@app/pages/trainer-pages/CourseGrading/components/ParticipantGrading'
import { CourseGradingDetails } from '@app/pages/trainer-pages/CourseGradingDetails'
import { CourseAttendance } from '@app/pages/trainer-pages/CourseGradingDetails/CourseAttendance'
import { ModulesSelection } from '@app/pages/trainer-pages/CourseGradingDetails/ModulesSelection'
import { EvaluationSummary } from '@app/pages/trainer-pages/EvaluationSummary'
import { TrainerCourses } from '@app/pages/trainer-pages/MyCourses'
import { TrainerFeedback } from '@app/pages/trainer-pages/TrainerFeedback'
import { AdminTransferParticipantPage } from '@app/pages/TransferParticipant/AdminTransferParticipant'
import { ChooseTransferCourse } from '@app/pages/TransferParticipant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/pages/TransferParticipant/components/TransferDetails'
import { TransferReview } from '@app/pages/TransferParticipant/components/TransferReview'
import { ArloConnect, ArloImport } from '@app/pages/tt-pages/Arlo'
import { Certifications } from '@app/pages/tt-pages/Certifications'
import { DiscountForm, DiscountsList } from '@app/pages/tt-pages/Discounts'
import { OrderDetails } from '@app/pages/tt-pages/OrderDetails'
import { Orders } from '@app/pages/tt-pages/Orders'
import { PricingList } from '@app/pages/tt-pages/Pricing'
import { XeroConnect } from '@app/pages/tt-pages/Xero'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'

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
          <Route path="modules" element={<CourseBuilderCommon />} />
          <Route path="details" element={<TrainerCourseDetails />} />
          <Route path="grading" element={<CourseGrading />} />
          <Route
            path="grading/:participantId"
            element={<ParticipantGrading />}
          />
          <Route path="grading-details" element={<CourseGradingDetails />}>
            <Route element={<CourseAttendance />} index />
            <Route path="modules" element={<ModulesSelection />} />
          </Route>
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
              <Route path="modules" element={<CourseBuilderCommon />} />
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
        <Route path="organisations">
          <Route index element={<Navigate replace to="all" />} />
          {acl.canEditOrAddOrganizations() ? (
            <Route path="new" element={<CreateOrganization />} />
          ) : null}
          <Route path="list" element={<Organizations />} />
          <Route path=":id">
            <Route index element={<OrgDashboard />} />
            {acl.canEditOrAddOrganizations() ? (
              <Route path="edit" element={<EditOrgDetails />} />
            ) : null}
            {acl.canEditOrAddOrganizations() ? (
              <Route path="invite" element={<InviteUserToOrganization />} />
            ) : null}
            <Route path="courses" element={<AvailableCourses />} />
          </Route>
        </Route>
      ) : null}

      <Route path="certifications" element={<Certifications />} />

      <Route path="orders">
        <Route index element={<Orders />} />

        <Route path=":id" element={<OrderDetails />} />
      </Route>

      {acl.canViewAdmin() ? (
        <>
          <Route path="admin">
            <Route index element={<AdminPage />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="users" element={<Users />}>
              {acl.canMergeProfiles() ? <Route path="merge" /> : undefined}
            </Route>

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
        </>
      ) : null}

      <Route path="resources/*" element={<ResourcesRoutes />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TTAdminRoutes
