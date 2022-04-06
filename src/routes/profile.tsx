import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { NotFound } from '@app/components/NotFound'
import { EditProfilePage } from '@app/pages/EditProfile'
import { MyProfilePage } from '@app/pages/MyProfile'

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
