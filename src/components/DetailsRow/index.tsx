import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material'
import React, { ReactNode } from 'react'

import { ElementProps } from '@app/types'

type TypographyProps = ElementProps<typeof Typography>
type BoxProps = ElementProps<typeof Box>

export const DetailsRow = ({
  label,
  value,
  labelProps,
  valueProps,
  containerProps,
  children,
  'data-testid': dataTestId,
}: {
  label: string | ReactNode
  value?: string | ReactNode
  labelProps?: TypographyProps
  valueProps?: TypographyProps
  containerProps?: BoxProps
  children?: React.ReactNode
  'data-testid'?: string
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const mobileBorder = isMobile
    ? {
        border: 2,
        width: '100%',
        borderColor: 'grey.200',
        borderRadius: 2,
        height: '3rem',
        paddingX: 1,
        verticalAlign: 'center',
      }
    : {}

  return (
    <Grid
      container
      display="flex"
      alignItems={isMobile ? 'start' : 'center'}
      flexDirection={isMobile ? 'column' : 'row'}
      {...(containerProps ?? {})}
    >
      <Grid item xs={12} md={4}>
        <Typography flex={1} color="grey.700" {...(labelProps ?? {})}>
          {label}
        </Typography>
      </Grid>
      {value ? (
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            ...mobileBorder,
          }}
        >
          <Typography
            data-testid={dataTestId}
            flex={2}
            {...(valueProps ?? {})}
            lineHeight={'3rem'}
          >
            {value}
          </Typography>
        </Grid>
      ) : null}
      {children}
    </Grid>
  )
}
