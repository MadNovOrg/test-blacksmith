import {
  Box,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material'
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

  return (
    <Grid
      container
      display="flex"
      alignItems={isMobile ? 'start' : 'center'}
      flexDirection={isMobile ? 'column' : 'row'}
      height="1.5rem"
      {...(containerProps ?? {})}
    >
      <Grid item xs={12} md={4}>
        <Typography
          flex={1}
          color="grey.700"
          {...(labelProps ?? {})}
          alignContent="center"
        >
          {label}
        </Typography>
      </Grid>
      {value ? (
        <Grid item xs={12} md={8}>
          <Tooltip title={value}>
            <Typography
              data-testid={dataTestId}
              flex={2}
              {...(valueProps ?? {})}
              lineHeight={'1.5rem'}
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value}
            </Typography>
          </Tooltip>
        </Grid>
      ) : null}
      {children}
    </Grid>
  )
}
