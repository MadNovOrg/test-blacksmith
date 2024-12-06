import { Box } from '@mui/material'
import React from 'react'

export const UnverifiedLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Box bgcolor="grey.200" flex={1}>
      {children}
    </Box>
  )
}
