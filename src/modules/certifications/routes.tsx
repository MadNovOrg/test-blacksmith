import { Route, Routes } from 'react-router-dom'

import { Certifications } from './pages/Certifications'
import { EditCertifications } from './pages/EditCertifications'

export const CertificationsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Certifications />} />
      <Route path="/edit" element={<EditCertifications />} />
    </Routes>
  )
}
