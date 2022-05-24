import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AdminPage } from '@app/pages/admin'
import Contacts from '@app/pages/admin/components/Contacts'
import Organizations from '@app/pages/admin/components/Organizations'
import { NotFound } from '@app/pages/common/NotFound'
import { CreateCourse } from '@app/pages/CreateCourse'
import { AssignTrainers } from '@app/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/CreateCourse/components/CreateCourseForm'
import { EditCourse } from '@app/pages/EditCourse'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { CourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { CourseGrading } from '@app/pages/trainer-pages/CourseGrading'
import { ParticipantGrading } from '@app/pages/trainer-pages/CourseGrading/components/ParticipantGrading'
import { MyCourses } from '@app/pages/trainer-pages/MyCourses'
import { Certifications } from '@app/pages/tt-pages/Certifications'
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

      <Route path="certifications" element={<Certifications />} />

      <Route path="orders" element={<Orders />} />

      <Route path="admin" element={<AdminPage />}>
        <Route index element={<Navigate replace to="organizations" />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="contacts" element={<Contacts />} />

        {acl.canViewXeroConnect() ? (
          <Route path="xero">
            <Route index element={<Navigate replace to="connect" />} />
            <Route path="connect" element={<XeroConnect />} />
          </Route>
        ) : null}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TTAdminRoutes
