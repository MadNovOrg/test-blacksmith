import { PauseCircle, PlayCircle } from '@mui/icons-material'
import { Box, Slider, styled, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import theme from '@app/theme'

import { Duration } from '../Duration'

const Progress = styled(Slider)({
  height: '8px',
  borderRadius: '4px',

  '& .MuiSlider-track': {
    border: 'none',
    borderRadius: '4px',
    transition: 'none',
  },

  '& .MuiSlider-rail': {
    backgroundColor: theme.palette.grey[400],
  },
  '& .MuiSlider-thumb': {
    display: 'none',
  },
})

const Thumbnail = styled('img')({
  maxWidth: '100%',
  borderRadius: '3px',
})

type Props = {
  thumbnailUrl: string
  title: string
  author: string
  mediaUrl: string
}

export const PodcastPlayer: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  author,
  thumbnailUrl,
  mediaUrl,
}) => {
  const audio = React.useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number>()
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const audioNode = audio.current

    const onLoadedMetadata = () => {
      if (audioNode) {
        setSecondsLeft(audio.current.duration)
      }
    }

    const onEnded = () => {
      setIsPlaying(false)
    }

    const onTimeUpdate = () => {
      if (audioNode?.duration) {
        setSecondsLeft(audioNode.duration - audioNode.currentTime)
        setProgress((audioNode.currentTime / audioNode.duration) * 100)
      }
    }

    if (audioNode) {
      audioNode?.addEventListener('loadedmetadata', onLoadedMetadata)
      audioNode.addEventListener('ended', onEnded)
      audioNode.addEventListener('timeupdate', onTimeUpdate)
    }

    return () => {
      if (audioNode) {
        audioNode.removeEventListener('loadedmetadata', onLoadedMetadata)
        audioNode.removeEventListener('ended', onEnded)
        audioNode.removeEventListener('timeupdate', onTimeUpdate)
      }
    }
  }, [])

  const togglePlayPause = () => {
    if (audio.current?.paused) {
      audio.current.play()
      setIsPlaying(true)
    } else {
      audio.current?.pause()
      setIsPlaying(false)
    }
  }

  const seekToPercentage = (_: unknown, value: number | number[]) => {
    if (audio.current) {
      audio.current.currentTime =
        audio.current.duration * ((value as number) / 100)
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      padding={1}
      sx={{ backgroundColor: theme.palette.grey[100] }}
    >
      {thumbnailUrl && (
        <Box width={139} mr={2}>
          <Thumbnail src={thumbnailUrl} alt={title} />
        </Box>
      )}
      <Box flexGrow={2}>
        <Typography mb={1} color={theme.palette.grey[800]}>
          {title}
        </Typography>
        <Typography variant="body2" mb={1}>
          {author}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {isPlaying ? (
            <PauseCircle
              color="primary"
              sx={{
                fontSize: 40,
                marginRight: theme.spacing(1),
                cursor: 'pointer',
              }}
              onClick={togglePlayPause}
            />
          ) : (
            <PlayCircle
              color="primary"
              sx={{
                fontSize: 40,
                marginRight: theme.spacing(1),
                cursor: 'pointer',
              }}
              onClick={togglePlayPause}
            />
          )}

          <Progress
            value={progress}
            onChange={seekToPercentage}
            sx={{
              marginRight: theme.spacing(1),
              flexGrow: 2,
            }}
          />
          <Duration
            duration={secondsLeft}
            variant="body2"
            sx={{ width: 50, textAlign: 'center' }}
          />
          <audio ref={audio} src={mediaUrl} preload="auto" autoPlay={false} />
        </Box>
      </Box>
    </Box>
  )
}
