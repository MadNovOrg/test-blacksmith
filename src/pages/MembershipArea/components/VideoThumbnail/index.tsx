import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import { Box } from '@mui/material'
import React from 'react'

import theme from '@app/theme'

import { Duration } from '../Duration'
import { PostImage } from '../PostImage'

type Props = {
  duration: number
  imageUrl: string
  alt: string
}

export const VideoThumbnail: React.FC<Props> = ({
  duration,
  imageUrl,
  alt,
}) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <PostImage src={imageUrl} alt={alt} />
      <PlayCircleIcon
        fontSize="large"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: theme.palette.common.white,
          fontSize: 60,
        }}
      />
      <Duration
        variant="body2"
        color={theme.palette.common.white}
        sx={{
          position: 'absolute',
          bottom: theme.spacing(1),
          left: theme.spacing(1),
        }}
        duration={duration}
      />
    </Box>
  )
}
