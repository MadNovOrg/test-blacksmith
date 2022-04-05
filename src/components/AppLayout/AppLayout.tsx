import { Box } from '@mui/material'
import React from 'react'

import { AppBar } from './AppBar'

type LayoutProps = {
  children: React.ReactNode
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <AppBar />

      {children}
    </Box>
  )
}
