import { Grid, GridProps } from '@mui/material'
import React from 'react'

import { BlogPostItemSkeleton } from '../BlogPostItem'

export const ItemsGridSkeleton: React.FC<
  React.PropsWithChildren<GridProps>
> = ({ ...rest }) => (
  <Grid
    {...rest}
    container
    rowSpacing={5}
    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
  >
    {Array(4)
      .fill(0, 0)
      .map((_, index) => (
        <Grid key={index} item lg={3} md={6} sm={12}>
          <BlogPostItemSkeleton />
        </Grid>
      ))}
  </Grid>
)
