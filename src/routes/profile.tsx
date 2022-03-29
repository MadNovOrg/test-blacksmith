import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { NotFound } from '@app/components/NotFound'

import { MyProfilePage } from '@app/pages/MyProfile'

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route index element={<MyProfilePage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default ProfileRoutes
