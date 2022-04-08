import InfoIcon from '@mui/icons-material/InfoOutlined'
import { Box, Typography } from '@mui/material'
import React from 'react'

import { IconDialog } from '@app/components/IconDialog'
import { ModuleGroup } from '@app/types'
import { formatDurationShort } from '@app/util'

type ModuleCardProps = {
  data: ModuleGroup
  bgColor: string
  hide?: boolean
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  data,
  bgColor,
  hide,
  ...props
}) => (
  <Box
    display={hide ? 'none' : 'flex'}
    flexDirection="column"
    position="relative"
    m={1}
    p={1}
    width={{ xs: '6rem', md: '7rem' }}
    height={{ xs: '6rem', md: '7rem' }}
    color="white"
    bgcolor={bgColor}
    borderRadius="0.375rem"
    {...props}
  >
    <Typography
      variant="caption"
      sx={{
        fontWeight: 600,
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        height: {
          xs: '4rem',
          md: '5rem',
        },
        wordBreak: 'break-word',
      }}
      data-testid="module-name"
    >
      {data.name}
    </Typography>
    <Typography
      variant="caption"
      position="absolute"
      bottom={3}
      left={4}
      data-testid="module-duration"
    >
      {formatDurationShort(data.duration.aggregate.sum.duration)}
    </Typography>
    <Box position="absolute" bottom={0} right={0}>
      <IconDialog icon={<InfoIcon />}>
        <>
          <Typography variant="body2" fontWeight="600">
            {data.name}:
          </Typography>
          {data.modules.map(module => (
            <Typography variant="body2" key={module.id}>
              {module.name}
            </Typography>
          ))}
        </>
      </IconDialog>
    </Box>
  </Box>
)
