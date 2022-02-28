import React from 'react'
import { Container } from '@mui/material'

import { AppBar } from './AppBar'

type LayoutProps = {
  children: React.ReactNode
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <AppBar />

      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {children}
      </Container>
    </div>
  )
}
