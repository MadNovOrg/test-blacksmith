import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { NotFound } from '@app/pages/common/NotFound'
import { MyOrganizationPage } from '@app/pages/MyOrganization'
import { OrganizationOverviewPage } from '@app/pages/MyOrganization/OrganizationOverviewPage'
import { ProfileListPage } from '@app/pages/MyOrganization/ProfileListPage'
import { ProfilePage } from '@app/pages/MyOrganization/ProfilePage'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { AcceptInvite } from '@app/pages/user-pages/AcceptInvite'
import { CourseDetails } from '@app/pages/user-pages/CourseDetails'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'
import { CourseHealthAndSafetyForm } from '@app/pages/user-pages/CourseHealthAndSafetyForm'
import { MyCertifications } from '@app/pages/user-pages/MyCertifications'
import { MyCourses } from '@app/pages/user-pages/MyCourses'

import MembershipRoutes from './membership'

const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path=":id">
          <Route path="details" element={<CourseDetails />} />
          <Route path="evaluation" element={<CourseEvaluation />} />
          <Route
            path="health-and-safety"
            element={<CourseHealthAndSafetyForm />}
          />
        </Route>
      </Route>

      <Route path="accept-invite/:id" element={<AcceptInvite />} />

      <Route path="certifications" element={<MyCertifications />} />

      <Route path="my-organization" element={<MyOrganizationPage />}>
        <Route index element={<Navigate replace to="overview" />} />
        <Route path="overview" element={<OrganizationOverviewPage />} />
        <Route path="profiles">
          <Route index element={<ProfileListPage />} />
          <Route path=":id" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="membership/*" element={<MembershipRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default UserRoutes
