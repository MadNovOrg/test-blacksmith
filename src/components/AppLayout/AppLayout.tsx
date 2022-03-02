import React from 'react'
import { Box, Container } from '@mui/material'

import { AppBar } from './AppBar'

type LayoutProps = {
  children: React.ReactNode
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <AppBar />

      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {children}
      </Container>
    </Box>
  )
}
