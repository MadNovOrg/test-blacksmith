import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { MembershipHeaderGradient } from '@app/assets'
import { Footer } from '@app/components/Footer'

import { BrowseByMedia } from './components/BrowseByMedia'

export function MembershipAreaPage() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <Box position="relative">
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: -1 }}>
        <MembershipHeaderGradient width="100%" height="30vh" />
      </Box>
      <Outlet />
      <Box mb={5}>
        <BrowseByMedia />
      </Box>

      <Footer />
    </Box>
  )
}
