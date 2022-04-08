import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { EditProfilePage } from '@app/pages/common/EditProfile'
import { MyProfilePage } from '@app/pages/common/MyProfile'
import { NotFound } from '@app/pages/common/NotFound'

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route index element={<MyProfilePage />} />
      <Route path="edit" element={<EditProfilePage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default ProfileRoutes
