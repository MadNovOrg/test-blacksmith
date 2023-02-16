import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import theme from '@app/theme'

import { InfoRow } from './InfoRow'

export { InfoRow }

export const InfoPanel: React.FC<
  React.PropsWithChildren<{
    title?: string
    titlePosition?: 'inside' | 'outside'
  }>
> = ({ title, children, titlePosition = 'inside', ...rest }) => (
  <Box {...rest}>
    {titlePosition === 'outside' && title ? (
      <Typography variant="h4" mb={2}>
        {title}
      </Typography>
    ) : null}
    <Box p={2} bgcolor={theme.palette.common.white}>
      {title && titlePosition === 'inside' ? (
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
      ) : null}
      {children}
    </Box>
  </Box>
)
