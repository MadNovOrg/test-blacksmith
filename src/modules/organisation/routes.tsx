import { Route, Navigate, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AvailableCourses } from '@app/pages/admin/components/Courses/AvailableCourses'

import { InviteUserToOrganization } from './components/InviteUserToOrganization/InviteUserToOrganization'
import { CreateOrganization } from './pages/CreateOrganization/CreateOrganization'
import { EditOrgDetails } from './pages/EditOrganization/EditOrgDetails'
import { OrgDashboard } from './pages/OrganisationDashboard/OrgDashboard'
import Organizations from './pages/Organisations/Organisations'

export const OrganisationRoutes: React.FC = () => {
  const { acl } = useAuth()
  return (
    <Routes>
      <Route index element={<Navigate replace to="all" />} />
      {acl.canCreateOrgs() ? (
        <Route path="new" element={<CreateOrganization />} />
      ) : null}
      <Route path="list" element={<Organizations />} />
      <Route path=":id">
        <Route index element={<OrgDashboard />} />
        {acl.canEditOrgs() ? (
          <Route path="edit" element={<EditOrgDetails />} />
        ) : null}
        {acl.canEditOrAddOrganizations() ? (
          <Route path="invite" element={<InviteUserToOrganization />} />
        ) : null}
        <Route path="courses" element={<AvailableCourses />} />
      </Route>
    </Routes>
  )
}
