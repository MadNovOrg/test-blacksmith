import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { ResourcesList, ResourceDetails } from '@app/pages/Resources'

function ResourcesRoutes() {
  return (
    <Routes>
      <Route index element={<ResourcesList />} />
      <Route path=":id" element={<ResourceDetails />} />
    </Routes>
  )
}

export default ResourcesRoutes
