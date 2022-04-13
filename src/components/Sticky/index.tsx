import { Box } from '@mui/material'
import React from 'react'

type Props = {
  top?: number
}

export const Sticky: React.FC<Props> = ({ children, top = 0 }) => (
  <Box sx={{ position: 'sticky', top: `${top}px` }}>{children}</Box>
)
