import { Route, Navigate, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AvailableCourses } from '@app/modules/course/pages/AvailableCourses/AvailableCourses'

import { InviteUserToOrganization } from './components/InviteUserToOrganization/InviteUserToOrganization'
import { CreateOrganization } from './pages/CreateOrganization/CreateOrganization'
import { EditOrgDetails as ANZEditOrgDetails } from './pages/EditOrganization/ANZ/EditOrgDetails'
import { EditOrgDetails as UKEditOrgDetails } from './pages/EditOrganization/UK/EditOrgDetails'
import { OrgDashboard } from './pages/OrganisationDashboard/OrgDashboard'
import { Organizations as ANZOrganisations } from './pages/Organisations/ANZ/Organisations'
import { Organizations as UKOrganisations } from './pages/Organisations/UK/Organisations'

export const OrganisationRoutes: React.FC = () => {
  const { acl } = useAuth()
  const isUKRegion = acl.isUK()
  return (
    <Routes>
      <Route index element={<Navigate replace to="all" />} />
      {acl.canCreateOrgs() ? (
        <Route path="new" element={<CreateOrganization />} />
      ) : null}
      <Route
        path="list"
        element={isUKRegion ? <UKOrganisations /> : <ANZOrganisations />}
      />
      <Route path=":id">
        <Route index element={<OrgDashboard />} />
        {acl.canEditOrgs() ? (
          <Route
            path="edit"
            element={isUKRegion ? <UKEditOrgDetails /> : <ANZEditOrgDetails />}
          />
        ) : null}
        {acl.canEditOrAddOrganizations() ? (
          <Route path="invite" element={<InviteUserToOrganization />} />
        ) : null}
        <Route path="courses" element={<AvailableCourses />} />
      </Route>
    </Routes>
  )
}
