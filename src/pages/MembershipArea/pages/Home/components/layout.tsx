import {
  GridProps,
  Grid,
  TypographyProps,
  Typography,
  Box,
  Link,
} from '@mui/material'
import React from 'react'

export const ContentGrid: React.FC<GridProps> = ({ children, ...rest }) => (
  <Grid
    {...rest}
    container
    rowSpacing={5}
    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
  >
    {children}
  </Grid>
)

export const ContentGridItem: React.FC<{
  [x: string | number | symbol]: unknown
}> = ({ children, ...rest }) => (
  <Grid item lg={3} md={6} sm={12} {...rest}>
    {children}
  </Grid>
)

export const GridTitle: React.FC<
  { icon: React.ReactElement; linkTo: string } & TypographyProps
> = ({ children, icon, linkTo, ...rest }) => {
  return (
    <Typography
      {...rest}
      variant="h5"
      fontWeight={600}
      sx={{
        marginBottom: 3,
        verticalAlign: 'middle',
        position: 'relative',
        zIndex: 1, // mui's grid item has top padding and covers the title, we have to make it on top
      }}
    >
      <Link href={linkTo} underline="none">
        <Box component="span" mr={1}>
          {icon}
        </Box>{' '}
        <Box component="span">{children}</Box>
      </Link>
    </Typography>
  )
}
