import { Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

import { PricingList } from './pages/PricingList'

export const PricingRoutes: React.FC = () => {
  const { acl } = useAuth()
  return (
    <Routes>
      {acl.canViewAdminPricing() ? (
        <Route index element={<PricingList />} />
      ) : null}
    </Routes>
  )
}
