import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AdminPage } from '@app/pages/admin'
import Contacts from '@app/pages/admin/components/Contacts'
import Organizations from '@app/pages/admin/components/Organizations'
import { CreateOrganization } from '@app/pages/admin/components/Organizations/CreateOrganization'
import { EditOrgDetails } from '@app/pages/admin/components/Organizations/EditOrgDetails'
import { InviteUserToOrganization } from '@app/pages/admin/components/Organizations/InviteUserToOrganization'
import { OrgDashboard } from '@app/pages/admin/components/Organizations/OrgDashboard'
import { NotFound } from '@app/pages/common/NotFound'
import { CreateCourse } from '@app/pages/CreateCourse'
import { AssignTrainers } from '@app/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/CreateCourse/components/CreateCourseForm'
import { TrainerExpenses } from '@app/pages/CreateCourse/components/TrainerExpenses'
import { EditCourse } from '@app/pages/EditCourse'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { CourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { CourseGrading } from '@app/pages/trainer-pages/CourseGrading'
import { ParticipantGrading } from '@app/pages/trainer-pages/CourseGrading/components/ParticipantGrading'
import { MyCourses } from '@app/pages/trainer-pages/MyCourses'
import { Certifications } from '@app/pages/tt-pages/Certifications'
import { DiscountCreate, DiscountsList } from '@app/pages/tt-pages/Discounts'
import { OrderDetails } from '@app/pages/tt-pages/OrderDetails'
import { Orders } from '@app/pages/tt-pages/Orders'
import { XeroConnect } from '@app/pages/tt-pages/Xero'

const TTAdminRoutes = () => {
  const { acl } = useAuth()

  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
          <Route path="trainer-expenses" element={<TrainerExpenses />} />
        </Route>

        <Route path="edit/:id" element={<EditCourse />} />

        <Route path=":id">
          <Route path="details" element={<CourseDetails />} />
          <Route path="grading" element={<CourseGrading />} />
          <Route
            path="grading/:participantId"
            element={<ParticipantGrading />}
          />
        </Route>
      </Route>

      {acl.canViewOrganizations() ? (
        <Route path="organizations">
          <Route index element={<Navigate replace to="all" />} />
          <Route path="new" element={<CreateOrganization />} />
          <Route path="list" element={<Organizations />} />
          <Route path=":id">
            <Route index element={<OrgDashboard />} />
            <Route path="edit" element={<EditOrgDetails />} />
            <Route path="invite" element={<InviteUserToOrganization />} />
          </Route>
        </Route>
      ) : null}

      <Route path="certifications" element={<Certifications />} />

      <Route path="orders">
        <Route index element={<Orders />} />

        <Route path=":id" element={<OrderDetails />} />
      </Route>

      {acl.isTTAdmin() ? (
        <Route path="admin" element={<AdminPage />}>
          <Route index element={<Navigate replace to="contacts" />} />

          <Route path="contacts" element={<Contacts />} />

          <Route path="discounts">
            <Route index element={<DiscountsList />} />
            <Route path="new" element={<DiscountCreate />} />
          </Route>

          {acl.canViewXeroConnect() ? (
            <Route path="xero">
              <Route index element={<Navigate replace to="connect" />} />
              <Route path="connect" element={<XeroConnect />} />
            </Route>
          ) : null}
        </Route>
      ) : null}

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TTAdminRoutes
