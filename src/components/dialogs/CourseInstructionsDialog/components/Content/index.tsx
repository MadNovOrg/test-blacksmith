import { Box } from '@mui/material'
import React from 'react'

import theme from '@app/theme'

type Props = {
  children?: React.ReactNode
}

export const Content: React.FC<Props> = ({ children }) => (
  <Box
    sx={{
      backgroundColor: theme.palette.grey[100],
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
    }}
  >
    {children}
  </Box>
)
