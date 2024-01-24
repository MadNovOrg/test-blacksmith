import { useFeatureFlagEnabled } from 'posthog-js/react'
import { Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { NotFound } from '@app/pages/common/NotFound'

import { Import } from './pages/Import/Import'
import { Users } from './pages/Users/Users'

export const UserRoutes: React.FC = () => {
  const { acl } = useAuth()

  const importUsersEnabled = useFeatureFlagEnabled('import-users-feature')

  return (
    <Routes>
      <Route index element={<Users />} />
      {acl.canMergeProfiles() ? (
        <Route path="merge" element={<Users />} />
      ) : null}

      {importUsersEnabled && acl.canImportUsers() ? (
        <Route path="import" element={<Import />} />
      ) : null}

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
