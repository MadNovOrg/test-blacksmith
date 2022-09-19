import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AvailableCourses } from '@app/pages/admin/components/Courses/AvailableCourses'
import Organizations from '@app/pages/admin/components/Organizations'
import { EditOrgDetails } from '@app/pages/admin/components/Organizations/EditOrgDetails'
import { InviteUserToOrganization } from '@app/pages/admin/components/Organizations/InviteUserToOrganization'
import { OrgDashboard } from '@app/pages/admin/components/Organizations/OrgDashboard'
import { NotFound } from '@app/pages/common/NotFound'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { AcceptInvite } from '@app/pages/user-pages/AcceptInvite'
import { AcceptOrgInvite } from '@app/pages/user-pages/AcceptOrgInvite'
import { CourseDetails } from '@app/pages/user-pages/CourseDetails'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'
import { CourseHealthAndSafetyForm } from '@app/pages/user-pages/CourseHealthAndSafetyForm'
import { MyCertifications } from '@app/pages/user-pages/MyCertifications'
import { MyCourses } from '@app/pages/user-pages/MyCourses'

import MembershipRoutes from './membership'

const UserRoutes = () => {
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
      <Route path="accept-org-invite/:id" element={<AcceptOrgInvite />} />

      <Route path="certifications" element={<MyCertifications />} />

      {acl.canViewOrganizations() ? (
        <Route path="organizations">
          <Route index element={<Navigate replace to="all" />} />
          <Route path="list" element={<Organizations />} />
          <Route path=":id">
            <Route index element={<OrgDashboard />} />
            <Route path="edit" element={<EditOrgDetails />} />
            <Route path="invite" element={<InviteUserToOrganization />} />
            <Route path="courses" element={<AvailableCourses />} />
          </Route>
        </Route>
      ) : null}

      <Route path="membership/*" element={<MembershipRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default UserRoutes
