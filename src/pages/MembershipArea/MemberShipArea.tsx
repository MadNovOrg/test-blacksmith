import React from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '@app/components/Footer'

export function MembershipAreaPage() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}
