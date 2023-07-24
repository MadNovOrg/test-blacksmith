import { Box } from '@mui/material'
import React from 'react'

import { AppBar } from '@app/components/AppBar'
import { Footer } from '@app/components/Footer'

type LayoutProps = {
  children: React.ReactNode
}

export const AppLayout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
}) => {
  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <AppBar />

      <Box component="main" flex={1}>
        {children}
      </Box>

      <Footer />
    </Box>
  )
}
