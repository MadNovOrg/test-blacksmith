import { Route, Navigate, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AvailableCourses } from '@app/modules/course/pages/AvailableCourses/AvailableCourses'

import { InviteUserToOrganization as ANZInviteUserToOrganization } from './components/InviteUserToOrganization/ANZ/InviteUserToOrganization'
import { InviteUserToOrganization as UKInviteUserToOrganization } from './components/InviteUserToOrganization/UK/InviteUserToOrganization'
import { CreateOrganization } from './pages/CreateOrganization/CreateOrganization'
import { EditOrgDetails as ANZEditOrgDetails } from './pages/EditOrganization/ANZ/EditOrgDetails'
import { EditOrgDetails as UKEditOrgDetails } from './pages/EditOrganization/UK/EditOrgDetails'
import { OrganisationImport } from './pages/Import'
import { Importing } from './pages/Import/components/Importing'
import { Preview } from './pages/Import/components/Preview'
import { Upload } from './pages/Import/components/Upload'
import { MergeOrganizationLogs } from './pages/MergeOrganizationLogs/MergeOrganizationLogs'
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
      {acl.isAdmin() ? (
        <Route
          path="/merge"
          element={isUKRegion ? <UKOrganisations /> : <ANZOrganisations />}
        />
      ) : null}
      {acl.isAdmin() ? (
        <Route path="/merge-logs" element={<MergeOrganizationLogs />} />
      ) : null}
      <Route path=":id">
        <Route index element={<OrgDashboard />} />
        {acl.canEditOrgs() ? (
          <Route
            path="edit"
            element={isUKRegion ? <UKEditOrgDetails /> : <ANZEditOrgDetails />}
          />
        ) : null}
        {acl.canEditOrAddOrganizations() ? (
          <Route
            path="invite"
            element={
              isUKRegion ? (
                <UKInviteUserToOrganization />
              ) : (
                <ANZInviteUserToOrganization />
              )
            }
          />
        ) : null}
        <Route path="courses" element={<AvailableCourses />} />
      </Route>
    </Routes>
  )
}

export const AdminOrganisationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="import" element={<OrganisationImport />}>
        <Route index element={<Upload />} />
        <Route path="preview" element={<Preview />} />
        <Route path="importing" element={<Importing />} />
        <Route path="results" element={<Importing />} />
      </Route>
    </Routes>
  )
}
