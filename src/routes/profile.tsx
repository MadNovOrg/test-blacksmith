import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { NotFound } from '@app/pages/common/NotFound'
import { MyProfilePage, EditProfilePage } from '@app/pages/common/profile'

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
