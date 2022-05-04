import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { AdminPage } from '@app/pages/admin'
import Contacts from '@app/pages/admin/components/Contacts'
import Organizations from '@app/pages/admin/components/Organizations'
import { Plans } from '@app/pages/admin/components/plans'
import { Trainees } from '@app/pages/admin/components/trainees'
import { Trainers } from '@app/pages/admin/components/trainers'
import { NotFound } from '@app/pages/common/NotFound'
import { CreateCourse } from '@app/pages/CreateCourse'
import { AssignTrainers } from '@app/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/CreateCourse/components/CreateCourseForm'
import { EditCourse } from '@app/pages/EditCourse'
import { MyCourses } from '@app/pages/trainer-pages/MyCourses'

const TTOpsRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
        </Route>

        <Route path="edit/:id" element={<EditCourse />} />

        <Route path=":id">
          <Route path="details" element={<div>TBD</div>} />
        </Route>
      </Route>

      <Route path="admin" element={<AdminPage />}>
        <Route index element={<Navigate replace to="organizations" />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="trainees" element={<Trainees />} />
        <Route path="plans" element={<Plans />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TTOpsRoutes
