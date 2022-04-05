import { Typography, Avatar, Box } from '@mui/material'
import React from 'react'

import { formatDateRange } from '@app/util'

export type EventCardProps = {
  startDate: Date | string
  endDate: Date | string
  children: React.ReactNode
}

export const EventCard: React.FC<EventCardProps> = ({
  startDate,
  endDate,
  children,
}) => {
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}> </Avatar>
        <Typography variant="h6">
          {formatDateRange(new Date(startDate), new Date(endDate))}
        </Typography>
      </Box>
      <Box mt={2}>{children}</Box>
    </Box>
  )
}
