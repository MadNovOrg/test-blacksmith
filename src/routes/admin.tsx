import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { AdminPage } from '@app/pages/admin'
import { Organizations } from '@app/pages/admin/components/Organizations'
import { Contacts } from '@app/pages/admin/components/Contacts'
import { Trainers } from '@app/pages/admin/components/trainers'
import { Trainees } from '@app/pages/admin/components/trainees'
import { Plans } from '@app/pages/admin/components/plans'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminPage />}>
        <Route index element={<Navigate to="organizations" />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="trainees" element={<Trainees />} />
        <Route path="plans" element={<Plans />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
