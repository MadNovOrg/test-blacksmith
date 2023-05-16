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
import { Users } from '@app/pages/admin/Users'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { CourseDetails as TrainerCourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { ParticipantGrading } from '@app/pages/trainer-pages/CourseGrading/components/ParticipantGrading'
import { EvaluationSummary } from '@app/pages/trainer-pages/EvaluationSummary'
import { AdminTransferParticipantPage } from '@app/pages/TransferParticipant/AdminTransferParticipant'
import { ChooseTransferCourse } from '@app/pages/TransferParticipant/components/ChooseTransferCourse'
import { TransferDetails } from '@app/pages/TransferParticipant/components/TransferDetails'
import { TransferReview } from '@app/pages/TransferParticipant/components/TransferReview'
import { Certifications } from '@app/pages/tt-pages/Certifications'
import { DiscountForm, DiscountsList } from '@app/pages/tt-pages/Discounts'
import { OrderDetails } from '@app/pages/tt-pages/OrderDetails'
import { Orders } from '@app/pages/tt-pages/Orders'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'

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

const CourseDetails = React.lazy(() =>
  import('@app/pages/trainer-pages/CourseDetails').then(module => ({
    default: module.CourseDetails,
  }))
)

const MyCourses = React.lazy(() =>
  import('@app/pages/trainer-pages/MyCourses').then(module => ({
    default: module.TrainerCourses,
  }))
)

const ResourcesRoutes = React.lazy(() => import('./resources'))
const MembershipRoutes = React.lazy(() => import('./membership'))

const SalesAdminRoutes = () => {
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
      </Route>

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
          <Route path="trainer-expenses" element={<TrainerExpenses />} />
          <Route path="review-and-confirm" element={<ReviewAndConfirm />} />
        </Route>

        <Route path="edit/:id" element={<EditCourse />} />

        <Route path=":id">
          <Route index element={<Navigate replace to="details" />} />
          <Route path="details" element={<CourseDetails />} />
          <Route
            path="grading/:participantId"
            element={<ParticipantGrading />}
          />
        </Route>
      </Route>

      <Route path="organisations">
        <Route index element={<Navigate replace to="all" />} />
        <Route path="new" element={<CreateOrganization />} />
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

      <Route path="membership/*" element={<MembershipRoutes />} />
      <Route path="resources/*" element={<ResourcesRoutes />} />

      <Route path="certifications" element={<Certifications />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

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
              <Route path="merge" />
            </Route>
            {acl.canViewAdminDiscount() ? (
              <Route path="discounts">
                <Route index element={<DiscountsList />} />
                <Route path="new" element={<DiscountForm />} />
                <Route path="edit/:id" element={<DiscountForm />} />
              </Route>
            ) : null}

            <Route path="audit" element={<AuditsPage />} />
          </Route>
        </>
      ) : null}

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default SalesAdminRoutes
