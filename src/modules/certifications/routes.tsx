import { Route, Routes } from 'react-router-dom'

import { Certifications } from './pages/Certifications'

export const CertificationsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Certifications />} />
    </Routes>
  )
}
