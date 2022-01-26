import React from 'react'

import { AppLayout } from '@app/components/AppLayout'

import { AppRoutes } from './AppRoutes'

import './style.css'

function App() {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  )
}

export default App
