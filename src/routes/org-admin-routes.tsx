import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { NotFound } from '@app/pages/common/NotFound'
import { MyOrganizationPage } from '@app/pages/MyOrganization'
import { OrganizationOverviewPage } from '@app/pages/MyOrganization/OrganizationOverviewPage'
import { ProfileListPage } from '@app/pages/MyOrganization/ProfileListPage'
import { ProfilePage } from '@app/pages/MyOrganization/ProfilePage'
import { MyCourses } from '@app/pages/trainer-pages/MyCourses'

const OrgAdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path=":id">
          <Route path="details" element={<div>TBD</div>} />
        </Route>
      </Route>

      <Route path="my-organization" element={<MyOrganizationPage />}>
        <Route index element={<Navigate replace to="overview" />} />
        <Route path="overview" element={<OrganizationOverviewPage />} />
        <Route path="profiles">
          <Route index element={<ProfileListPage />} />
          <Route path=":id" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default OrgAdminRoutes
