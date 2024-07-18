import { Skeleton, Grid, Typography, BoxProps, Box } from '@mui/material'
import React from 'react'

type Props = {
  num: number
  perRow?: number
  withTitle?: boolean
} & BoxProps

export const ResourceListSkeleton: React.FC<Props> = ({
  num,
  perRow = 4,
  withTitle = false,
  ...rest
}) => {
  return (
    <Box {...rest}>
      {withTitle ? (
        <Typography variant="h1">
          <Skeleton width={200} sx={{ mb: 3 }} />
        </Typography>
      ) : null}
      <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {Array(num)
          .fill(0, 0)
          .map((_, index) => (
            <Grid key={index} item md={12 / perRow} sm={12}>
              <Skeleton variant="rectangular" height={190} />
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}
