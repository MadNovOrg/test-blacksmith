import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { HomePage } from '@app/pages/Home'
import { AccountPage } from '@app/pages/Account'

export const AppRoutes: React.FC<unknown> = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="account" element={<AccountPage />} />
    </Routes>
  )
}
