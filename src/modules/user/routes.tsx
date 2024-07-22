import { Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { NotFound } from '@app/modules/not_found/pages/NotFound'

import { Import } from './pages/Import/Import'
import { ChooseFile } from './pages/Import/steps/ChooseFile/ChooseFile'
import { Configure } from './pages/Import/steps/Configure/Configure'
import { Importing } from './pages/Import/steps/Importing/Importing'
import { Preview } from './pages/Import/steps/Preview/Preview'
import { Users } from './pages/Users/User/Users'

export const UserRoutes: React.FC = () => {
  const { acl } = useAuth()

  return (
    <Routes>
      <Route index element={<Users />} />
      {acl.canMergeProfiles() ? (
        <Route path="merge" element={<Users />} />
      ) : null}

      {acl.canImportUsers() ? (
        <Route path="import" element={<Import />}>
          <Route index element={<ChooseFile />} />
          <Route path="configure" element={<Configure />} />
          <Route path="preview" element={<Preview />} />
          <Route path="importing" element={<Importing />} />
          <Route path="results" element={<Importing />} />
        </Route>
      ) : null}

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
