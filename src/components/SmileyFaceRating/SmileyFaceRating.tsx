import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import { Box, Typography, styled } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const customIcons = [
  {
    icon: <SentimentVerySatisfiedIcon fontSize="inherit" />,
    label: 'excellent',
    rating: 5,
  },
  {
    icon: <SentimentSatisfiedAltIcon fontSize="inherit" />,
    label: 'good',
    rating: 4,
  },
  {
    icon: <SentimentSatisfiedIcon fontSize="inherit" />,
    label: 'average',
    rating: 3,
  },
  {
    icon: <SentimentDissatisfiedIcon fontSize="inherit" />,
    label: 'fair',
    rating: 2,
  },
  {
    icon: <SentimentVeryDissatisfiedIcon fontSize="inherit" />,
    label: 'poor',
    rating: 1,
  },
]

const SmileyFacesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',

  '& .icon': {
    color: theme.palette.grey[300],
    cursor: 'pointer',
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '& .rating-label': {
      visibility: 'hidden',
      textTransform: 'capitalize',
    },
    '&.readOnly': {
      pointerEvents: 'none',
    },
    '&.active': {
      transform: 'scale(1.1)',
      '&.rating-1': {
        color: theme.palette.error.dark,
      },
      '&.rating-2': {
        color: theme.palette.error.main,
      },
      '&.rating-3': {
        color: theme.palette.warning.main,
      },
      '&.rating-4': {
        color: theme.palette.success.main,
      },
      '&.rating-5': {
        color: '#59C13D',
      },
      '& .rating-label': {
        visibility: 'visible',
      },
    },
  },
}))

export type SmileyFaceRatingProps = {
  value: string
  onChange: (_: number | null) => void
  readOnly?: boolean
}

export const SmileyFaceRating: React.FC<
  React.PropsWithChildren<SmileyFaceRatingProps>
> = ({ value, onChange, readOnly = false }) => {
  const { t } = useTranslation()
  const [activeIcon, setActiveIcon] = useState(+value)

  const handleHover = (rating: number) => {
    setActiveIcon(rating)
  }

  return (
    <SmileyFacesContainer data-testid="smiley-faces-container">
      {customIcons.map(obj => {
        const { icon, label, rating } = obj
        const iconActive = rating === activeIcon

        return (
          <Box
            key={rating}
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={0.5}
            fontSize={50}
            className={`${iconActive ? 'active' : ''} ${
              readOnly ? 'readOnly' : ''
            } icon rating-${rating}`}
            data-testid="rating"
            data-rating={`rating-${rating}`}
            onClick={() => onChange(rating)}
            onMouseEnter={() => handleHover(rating)}
            onMouseLeave={() => handleHover(+value)}
          >
            {icon}
            <Typography
              color="common.black"
              variant="caption"
              fontWeight="500"
              className="rating-label"
            >
              {t(label)}
            </Typography>
          </Box>
        )
      })}
    </SmileyFacesContainer>
  )
}
