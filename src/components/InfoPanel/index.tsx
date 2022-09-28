import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import theme from '@app/theme'

import { InfoRow } from './InfoRow'

export { InfoRow }

export const InfoPanel: React.FC<{ title?: string }> = ({
  title,
  children,
}) => (
  <Box p={2} bgcolor={theme.palette.common.white}>
    {title ? (
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
    ) : null}
    {children}
  </Box>
)
