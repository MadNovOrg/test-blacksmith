import { Box, Typography } from '@mui/material'
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
}: {
  label: string | ReactNode
  value?: string | ReactNode
  labelProps?: TypographyProps
  valueProps?: TypographyProps
  containerProps?: BoxProps
  children?: React.ReactNode
}) => (
  <Box display="flex" alignItems="center" {...(containerProps ?? {})}>
    <Typography flex={1} color="grey.700" {...(labelProps ?? {})}>
      {label}
    </Typography>
    {value ? (
      <Typography flex={2} {...(valueProps ?? {})}>
        {value}
      </Typography>
    ) : null}
    {children}
  </Box>
)
