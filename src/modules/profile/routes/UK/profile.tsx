import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { NotFound } from '@app/modules/not_found/pages/NotFound'

import { EditProfilePage } from '../../pages/EditProfile/UK'
import { ViewProfilePage } from '../../pages/ViewProfile'

const ProfileRoutes = () => {
  return (
    <Routes>
      {/*current user profile read/update*/}
      <Route index element={<ViewProfilePage />} />
      <Route path="edit" element={<EditProfilePage />} />

      {/*other users profile read/update*/}
      <Route path=":id">
        <Route index element={<ViewProfilePage />} />
        <Route path="edit" element={<EditProfilePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default ProfileRoutes
