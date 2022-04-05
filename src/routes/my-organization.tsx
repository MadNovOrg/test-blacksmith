import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { NotFound } from '@app/components/NotFound'
import { MyOrganizationPage } from '@app/pages/MyOrganization'
import { OrganizationOverviewPage } from '@app/pages/MyOrganization/OrganizationOverviewPage'
import { ProfileListPage } from '@app/pages/MyOrganization/ProfileListPage'
import { ProfilePage } from '@app/pages/MyOrganization/ProfilePage'

const MyOrganizationRoutes = () => {
  return (
    <Routes>
      <Route element={<MyOrganizationPage />}>
        <Route index element={<Navigate replace to="overview" />} />
        <Route path="overview" element={<OrganizationOverviewPage />} />
        <Route path="profiles" element={<ProfileListPage />} />
        <Route path="profiles/:id" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default MyOrganizationRoutes
