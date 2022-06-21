import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import { Box } from '@mui/material'
import React from 'react'

import theme from '@app/theme'

import { Duration } from '../Duration'
import { PostImage } from '../PostImage'

type Props = {
  duration: number
  imageUrl: string
  imageSrcSet?: string
  alt: string
  durationPosition?: 'center' | 'bottom-left'
  image?: React.ReactElement
}

export const VideoThumbnail: React.FC<Props> = ({
  duration,
  imageUrl,
  imageSrcSet,
  alt,
  durationPosition = 'bottom-left',
  image,
}) => {
  const imageComponent = image ?? (
    <PostImage src={imageUrl} alt={alt} srcSet={imageSrcSet} />
  )

  return (
    <Box sx={{ position: 'relative' }}>
      {imageComponent}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: theme.palette.common.white,
          textAlign: 'center',
        }}
      >
        <PlayCircleIcon sx={{ fontSize: 60 }} />
        {durationPosition === 'center' ? (
          <Duration
            variant="body2"
            color={theme.palette.common.white}
            sx={{
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.4)',
            }}
            duration={duration}
          />
        ) : null}
      </Box>

      {durationPosition === 'bottom-left' ? (
        <Duration
          variant="body2"
          color={theme.palette.common.white}
          sx={{
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.4)',
            position: 'absolute',
            bottom: theme.spacing(2),
            left: theme.spacing(1),
          }}
          duration={duration}
        />
      ) : null}
    </Box>
  )
}
