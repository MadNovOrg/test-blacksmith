import { Grid, GridProps } from '@mui/material'
import React from 'react'

import { BlogPostItemSkeleton } from '../BlogPostItem'

export const ItemsGridSkeleton: React.FC<GridProps> = ({ ...rest }) => (
  <Grid
    {...rest}
    container
    rowSpacing={5}
    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
  >
    <Grid item xs={3}>
      <BlogPostItemSkeleton />
    </Grid>
    <Grid item xs={3}>
      <BlogPostItemSkeleton />
    </Grid>
    <Grid item xs={3}>
      <BlogPostItemSkeleton />
    </Grid>
    <Grid item xs={3}>
      <BlogPostItemSkeleton />
    </Grid>
  </Grid>
)
