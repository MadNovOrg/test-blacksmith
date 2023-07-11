import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AdminPage } from '@app/pages/admin'
import { AuditsPage } from '@app/pages/admin/Audits'
import { AvailableCourses } from '@app/pages/admin/components/Courses/AvailableCourses'
import { ManageCourses } from '@app/pages/admin/components/Courses/ManageCourses'
import Organizations from '@app/pages/admin/components/Organizations'
import { InviteUserToOrganization } from '@app/pages/admin/components/Organizations/InviteUserToOrganization'
import { OrgDashboard } from '@app/pages/admin/components/Organizations/OrgDashboard'
import { Contacts } from '@app/pages/admin/Contacts'
import { Users } from '@app/pages/admin/Users'
import { OrderDetails as CourseOrderDetails } from '@app/pages/CreateCourse/components/OrderDetails'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { ParticipantGrading } from '@app/pages/trainer-pages/CourseGrading/components/ParticipantGrading'
import { EvaluationSummary } from '@app/pages/trainer-pages/EvaluationSummary'
import { TrainerFeedback } from '@app/pages/trainer-pages/TrainerFeedback'
import { Certifications } from '@app/pages/tt-pages/Certifications'
import { DiscountForm, DiscountsList } from '@app/pages/tt-pages/Discounts'
import { OrderDetails } from '@app/pages/tt-pages/OrderDetails'
import { Orders } from '@app/pages/tt-pages/Orders'
import { PricingList } from '@app/pages/tt-pages/Pricing'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'

import ResourcesRoutes from './resources'

const NotFound = React.lazy(() =>
  import('@app/pages/common/NotFound').then(module => ({
    default: module.NotFound,
  }))
)

const CreateCourse = React.lazy(() =>
  import('@app/pages/CreateCourse').then(module => ({
    default: module.CreateCourse,
  }))
)

const AssignTrainers = React.lazy(() =>
  import('@app/pages/CreateCourse/components/AssignTrainers').then(module => ({
    default: module.AssignTrainers,
  }))
)

const TrainerExpenses = React.lazy(() =>
  import('@app/pages/CreateCourse/components/TrainerExpenses').then(module => ({
    default: module.TrainerExpenses,
  }))
)

const ReviewAndConfirm = React.lazy(() =>
  import('@app/pages/CreateCourse/components/ReviewAndConfirm').then(
    module => ({
      default: module.ReviewAndConfirm,
    })
  )
)

const CreateCourseForm = React.lazy(() =>
  import('@app/pages/CreateCourse/components/CreateCourseForm').then(
    module => ({
      default: module.CreateCourseForm,
    })
  )
)

const EditCourse = React.lazy(() =>
  import('@app/pages/EditCourse').then(module => ({
    default: module.EditCourse,
  }))
)

const MyCourses = React.lazy(() =>
  import('@app/pages/trainer-pages/MyCourses').then(module => ({
    default: module.TrainerCourses,
  }))
)

const MembershipRoutes = React.lazy(() => import('./membership'))

const FinanceRoute = () => {
  const { acl } = useAuth()

  return (
    <Routes>
      <Route index element={<Navigate replace to="manage-courses" />} />

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

        <Route path="edit/:id" element={<EditCourse />} />

        <Route path=":id">
          <Route index element={<Navigate replace to="details" />} />
          <Route path="details" element={<TrainerCourseDetails />} />
          <Route
            path="grading/:participantId"
            element={<ParticipantGrading />}
          />
        </Route>
      </Route>

      <Route path="admin">
        <Route path="users" element={<Users />} />
      </Route>

      <Route path="organisations">
        <Route index element={<Navigate replace to="all" />} />
        <Route path="list" element={<Organizations />} />
        <Route path=":id">
          <Route index element={<OrgDashboard />} />
          {acl.canEditOrAddOrganizations() ? (
            <Route path="invite" element={<InviteUserToOrganization />} />
          ) : null}
          <Route path="courses" element={<AvailableCourses />} />
        </Route>
      </Route>

      <Route path="membership/*" element={<MembershipRoutes />} />

      <Route path="certifications" element={<Certifications />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="orders">
        <Route index element={<Orders />} />

        <Route path=":id" element={<OrderDetails />} />
      </Route>

      <Route path="resources/*" element={<ResourcesRoutes />} />

      <Route path="*" element={<NotFound />} />
      {acl.canViewAdmin() ? (
        <>
          <Route path="admin">
            <Route index element={<AdminPage />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="users" element={<Users />} />
            {acl.canViewAdminPricing() ? (
              <Route path="pricing">
                <Route index element={<PricingList />} />
              </Route>
            ) : null}
            <Route path="discounts">
              <Route index element={<DiscountsList />} />
              <Route path="new" element={<DiscountForm />} />
              <Route path="edit/:id" element={<DiscountForm />} />
            </Route>

            <Route path="audit" element={<AuditsPage />} />
          </Route>
        </>
      ) : null}
    </Routes>
  )
}

export default FinanceRoute
