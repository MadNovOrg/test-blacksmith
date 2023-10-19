import React from 'react'
import { Route, Routes } from 'react-router-dom'

import {
  ResourcesList,
  ResourceDetails,
  ResourceVideoItem,
} from '@app/pages/Resources'

function ResourcesRoutes() {
  return (
    <Routes>
      <Route index element={<ResourcesList />} />
      <Route path=":id" element={<ResourceDetails />} />
      <Route
        path="/video-resource/:resourceName/:accessProtocol/*"
        element={<ResourceVideoItem />}
      />
    </Routes>
  )
}

export default ResourcesRoutes
