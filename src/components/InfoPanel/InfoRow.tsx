import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import theme from '@app/theme'

export const InfoRow: React.FC<{
  label?: string
  value?: string | React.ReactElement
}> = ({ label, value, children }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
    {children ? (
      children
    ) : (
      <>
        {label ? (
          <Typography color={theme.palette.grey[600]}>{label}</Typography>
        ) : null}

        {value ? <Typography>{value}</Typography> : null}
      </>
    )}
  </Box>
)
