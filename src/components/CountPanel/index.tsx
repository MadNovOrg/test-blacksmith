import { Chip } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React from 'react'

export type CountPanelParams = {
  count: number
  label: string
  chip?: {
    color:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning'
    label: string
  }
}

export const CountPanel: React.FC<CountPanelParams> = ({
  count,
  label,
  chip,
}) => {
  return (
    <Box
      bgcolor="common.white"
      display="flex"
      flexDirection="row"
      p={2}
      gap={2}
      alignItems="center"
      height={80}
    >
      <Typography variant="h2" mx={2}>
        {count}
      </Typography>

      {chip ? (
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <Chip label={chip.label} size="small" color={chip.color} />
          </Box>
          <Typography variant="body2">{label}</Typography>
        </Box>
      ) : (
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
      )}
    </Box>
  )
}
