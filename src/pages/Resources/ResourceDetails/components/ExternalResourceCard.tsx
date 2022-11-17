import LaunchIcon from '@mui/icons-material/Launch'
import { Card, Box, Typography } from '@mui/material'
import React, { ReactNode } from 'react'

export type Props = {
  icon: ReactNode
  text: string
}

export const ExternalResourceCard = ({ icon, text }: Props) => {
  return (
    <Card sx={{ boxShadow: 'none', p: 1 }}>
      <Box display="flex" gap={4} alignItems="center">
        {icon}
        <Typography fontWeight={600} sx={{ flexGrow: 1 }} lineHeight="28px">
          {text}
        </Typography>
        <LaunchIcon fontSize="small" sx={{ cursor: 'pointer' }} />
      </Box>
    </Card>
  )
}

export default ExternalResourceCard
