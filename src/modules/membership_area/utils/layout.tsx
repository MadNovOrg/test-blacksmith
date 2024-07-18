import {
  Box,
  Grid,
  GridProps,
  Link,
  Typography,
  TypographyProps,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

export const ContentGrid: React.FC<React.PropsWithChildren<GridProps>> = ({
  children,
  ...rest
}) => (
  <Grid
    {...rest}
    container
    rowSpacing={5}
    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
  >
    {children}
  </Grid>
)

export const ContentGridItem: React.FC<
  React.PropsWithChildren<{
    [x: string | number | symbol]: unknown
  }>
> = ({ children, ...rest }) => (
  <Grid item lg={3} md={6} sm={12} {...rest}>
    {children}
  </Grid>
)

export const GridHeader: React.FC<React.PropsWithChildren<GridProps>> = ({
  children,
}) => {
  return (
    <Box
      justifyContent="space-between"
      sx={{ display: 'flex', mb: theme.spacing(2) }}
    >
      {children}
    </Box>
  )
}

export const GridTitle: React.FC<
  React.PropsWithChildren<
    { icon: React.ReactElement; linkTo: string } & TypographyProps
  >
> = ({ children, icon, linkTo, ...rest }) => {
  return (
    <Typography
      {...rest}
      variant="h5"
      fontWeight={600}
      sx={{
        display: 'flex',
        alignItems: 'center',
        zIndex: 1, // mui's grid item has top padding and covers the title, we have to make it on top
      }}
    >
      <Link
        href={linkTo}
        underline="none"
        alignItems="center"
        sx={{ display: 'flex' }}
      >
        {icon}
        <Box component="span" ml={1}>
          {children}
        </Box>
      </Link>
    </Typography>
  )
}

export const GridShowAll: React.FC<
  React.PropsWithChildren<{ linkTo: string }>
> = ({ linkTo }) => {
  const { t } = useTranslation()

  return (
    <Link
      alignItems="center"
      href={linkTo}
      sx={{
        display: 'flex',
        zIndex: 1, // mui's grid item has top padding and covers the title, we have to make it on top
      }}
      underline="none"
    >
      {t('pages.membership.components.grid-show-all-button.see-all')}
    </Link>
  )
}
