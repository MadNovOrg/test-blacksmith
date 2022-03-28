import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { MyProfilePage } from '@app/pages/MyProfile'

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route index element={<MyProfilePage />} />
    </Routes>
  )
}

export default ProfileRoutes
