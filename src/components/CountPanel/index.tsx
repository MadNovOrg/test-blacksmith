import InfoIcon from '@mui/icons-material/Info'
import { Chip, Tooltip, Box, CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'

import { Tile } from '../Tile'

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
      | 'gray'
    label: string
  }
  tooltip?: string
  fetching?: boolean
}

export const CountPanel: React.FC<
  React.PropsWithChildren<CountPanelParams>
> = ({ count, label, chip, tooltip, fetching }) => {
  return (
    <Tile flexDirection="row" gap={2}>
      <Typography variant="h2" mx={2}>
        {fetching ? <CircularProgress /> : count}
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
          {!fetching ? label : null}
        </Typography>
      )}

      {tooltip ? (
        <Box display="flex" flexGrow={1} justifyContent={'flex-end'}>
          <Tooltip title={tooltip}>
            <InfoIcon color={'action'} />
          </Tooltip>
        </Box>
      ) : null}
    </Tile>
  )
}
