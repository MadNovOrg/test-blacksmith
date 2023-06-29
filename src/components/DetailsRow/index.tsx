import { Box, Grid, Typography, Tooltip } from '@mui/material'
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
  return (
    <Grid
      container
      {...(containerProps ?? {})}
      maxWidth={window.innerWidth / 2}
    >
      <Grid item xs={12} md={5}>
        <Box>
          <Typography
            flex={1}
            color="grey.900"
            {...(labelProps ?? {})}
            alignContent="center"
          >
            {label}
          </Typography>
        </Box>
      </Grid>
      {value ? (
        <Grid item xs={12} md={7}>
          <Box>
            <Tooltip title={value}>
              <Typography
                data-testid={dataTestId}
                color="grey.600"
                flex={2}
                {...(valueProps ?? {})}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {value}
              </Typography>
            </Tooltip>
          </Box>
        </Grid>
      ) : null}
      {children}
    </Grid>
  )
}
