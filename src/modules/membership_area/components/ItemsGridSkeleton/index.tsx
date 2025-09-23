import { Grid, GridProps } from '@mui/material'
import React from 'react'

import { BlogPostItemSkeleton } from '../BlogPostItem'

type ItemsGridSkeletonProps = {
  num?: number
} & GridProps

export const ItemsGridSkeleton: React.FC<
  React.PropsWithChildren<ItemsGridSkeletonProps>
> = ({ num = 4, ...rest }) => (
  <Grid
    {...rest}
    container
    rowSpacing={5}
    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
  >
    {Array(num)
      .fill(0, 0)
      .map((_, index) => (
        <Grid key={index} item lg={3} md={6} sm={12}>
          <BlogPostItemSkeleton />
        </Grid>
      ))}
  </Grid>
)
