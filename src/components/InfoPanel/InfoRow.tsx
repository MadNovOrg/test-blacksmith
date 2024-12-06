import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import theme from '@app/theme'

export const InfoRow: React.FC<
  React.PropsWithChildren<{
    label?: string
    value?: string | React.ReactElement
  }>
> = ({ label, value, children }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    mt={1}
    data-testid={`${label}-info-row`}
  >
    {children || (
      <>
        {label ? (
          <Typography color={theme.palette.grey[600]}>{label}</Typography>
        ) : null}

        {value ? <Typography>{value}</Typography> : null}
      </>
    )}
  </Box>
)
