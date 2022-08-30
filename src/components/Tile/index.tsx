import { Box, BoxProps } from '@mui/material'
import React from 'react'

export const Tile: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    bgcolor="common.white"
    display="flex"
    p={2}
    alignItems="center"
    minHeight={80}
    {...props}
  >
    {children}
  </Box>
)
