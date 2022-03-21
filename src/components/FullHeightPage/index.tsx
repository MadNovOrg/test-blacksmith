import { Box } from '@mui/material'
import { BoxProps } from '@mui/system'
import React from 'react'

const APP_BAR_HEIGHT = 114

export const FullHeightPage: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box {...props} minHeight={`calc(100vh - ${APP_BAR_HEIGHT}px)`}>
      {children}
    </Box>
  )
}
