import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { MembershipAreaPage } from '@app/pages/MembershipArea'
import { MembershipDetailsPage } from '@app/pages/MembershipArea/MemberShipDetails'
import { BlogPage } from '@app/pages/MembershipArea/BlogPage'
import { BlogPostPage } from '@app/pages/MembershipArea/BlogPostPage'

const MembershipRoutes = () => {
  return (
    <Routes>
      <Route element={<MembershipAreaPage />}>
        <Route index element={<Navigate to="details" />} />
        <Route path="details" element={<MembershipDetailsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:postId" element={<BlogPostPage />} />
      </Route>
    </Routes>
  )
}

export default MembershipRoutes
