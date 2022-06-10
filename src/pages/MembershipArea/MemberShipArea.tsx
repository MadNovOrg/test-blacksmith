import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { MembershipHeaderGradient } from '@app/assets'
import { Footer } from '@app/components/Footer'

export function MembershipAreaPage() {
  return (
    <Box position="relative">
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: -1 }}>
        <MembershipHeaderGradient width="100%" height="30vh" />
      </Box>
      <Outlet />
      <Footer />
    </Box>
  )
}
