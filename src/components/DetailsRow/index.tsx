import { Box, Typography } from '@mui/material'
import React from 'react'

export const DetailsRow = ({
  label,
  value,
}: {
  label: string
  value: string | null
}) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Typography flex={1} color="grey.700">
      {label}
    </Typography>
    <Typography flex={2}>{value}</Typography>
  </Box>
)
