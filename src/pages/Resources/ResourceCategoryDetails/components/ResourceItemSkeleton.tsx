import { Box, Skeleton, Typography } from '@mui/material'
import React from 'react'

export const ResourceTitleSkeleton = () => (
  <Box data-testid="resource-category-skeleton">
    <Typography variant="h1">
      <Skeleton variant="rectangular" height={50} sx={{ marginBottom: 2 }} />
    </Typography>

    <Skeleton />
    <Skeleton />
    <Skeleton />
  </Box>
)

export const ResourceItemsSkeleton = () => (
  <Box data-testid="resources-skeleton">
    <Skeleton height={70} />
    <Skeleton height={70} />
    <Skeleton height={70} />
    <Skeleton height={70} />
  </Box>
)
