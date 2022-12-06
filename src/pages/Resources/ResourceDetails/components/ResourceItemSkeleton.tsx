import { Box, Skeleton } from '@mui/material'
import React from 'react'

export const ResourceTitleSkeleton = () => (
  <Box width={300}>
    <Skeleton variant="rectangular" height={50} sx={{ marginBottom: 2 }} />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </Box>
)

export const ResourceItemsSkeleton = () => (
  <Box>
    <Skeleton height={70} />
    <Skeleton height={70} />
    <Skeleton height={70} />
    <Skeleton height={70} />
  </Box>
)
