import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { NotFound } from '@app/components/NotFound'
import { MembershipAreaPage } from '@app/pages/MembershipArea'
import { BlogPage } from '@app/pages/MembershipArea/BlogPage'
import { BlogPostPage } from '@app/pages/MembershipArea/BlogPostPage'
import { MembershipDetailsPage } from '@app/pages/MembershipArea/MemberShipDetails'

const MembershipRoutes = () => {
  return (
    <Routes>
      <Route element={<MembershipAreaPage />}>
        <Route index element={<Navigate replace to="details" />} />
        <Route path="details" element={<MembershipDetailsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:postId" element={<BlogPostPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default MembershipRoutes
