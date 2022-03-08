import React from 'react'
import { Box, Typography } from '@mui/material'

import { ModuleGroup } from '@app/types'
import { formatDurationShort } from '@app/util'

type ModuleCardProps = {
  data: ModuleGroup
  bgColor: string
  hide?: boolean
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  data,
  bgColor,
  hide,
  ...props
}) => (
  <Box
    display={hide ? 'none' : 'flex'}
    flexDirection="column"
    position="relative"
    m={1}
    p={1}
    width={{ xs: '6rem', md: '7rem' }}
    height={{ xs: '6rem', md: '7rem' }}
    color="white"
    bgcolor={bgColor}
    borderRadius="0.375rem"
    justifyContent="center"
    {...props}
  >
    <Typography mb={1} variant="caption" fontWeight="600" textAlign="center">
      {data.name}
    </Typography>
    <Typography variant="caption" position="absolute" bottom={3} left={4}>
      {formatDurationShort(data.duration.aggregate.sum.duration)}
    </Typography>
  </Box>
)
