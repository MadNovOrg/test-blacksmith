import { Box, Typography } from '@mui/material'
import React from 'react'

type Props = {
  titleTestId: string
  title: string
  firstRowCount: number
  firstRowLabel: string
  secondRowCount: number
  secondRowLabel: string
}

export const TileContent: React.FC<React.PropsWithChildren<Props>> = ({
  titleTestId,
  title,
  firstRowCount,
  firstRowLabel,
  secondRowCount,
  secondRowLabel,
}) => (
  <Box>
    <Typography variant="h6" mb={2} data-testid={titleTestId}>
      {title}
    </Typography>
    <Box display="flex" gap={1} alignItems="center">
      <Typography variant="h4">{firstRowCount}</Typography>
      <Typography variant="body2">{firstRowLabel}</Typography>
    </Box>
    <Box display="flex" gap={1} alignItems="center">
      <Typography variant="h4">{secondRowCount}</Typography>
      <Typography variant="body2">{secondRowLabel}</Typography>
    </Box>
  </Box>
)
