import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import { Box, IconContainerProps, Typography } from '@mui/material'
import Rating from '@mui/material/Rating'
import React from 'react'
import { useTranslation } from 'react-i18next'

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon fontSize="inherit" />,
    label: 'poor',
  },
  2: {
    icon: <SentimentDissatisfiedIcon fontSize="inherit" />,
    label: 'fair',
  },
  3: {
    icon: <SentimentSatisfiedIcon fontSize="inherit" />,
    label: 'average',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon fontSize="inherit" />,
    label: 'good',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon fontSize="inherit" />,
    label: 'excellent',
  },
}

type Value = keyof typeof customIcons

const IconContainer: React.FC<IconContainerProps> = ({
  value,
  className,
  ...rest
}) => {
  const { t } = useTranslation()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={0.5}
      fontSize={50}
      className={`${className} rating-${value}`}
      data-testid={`rating-${value}`}
      {...rest}
    >
      {customIcons[value as Value].icon}
      <Typography
        color="common.black"
        variant="caption"
        fontWeight="500"
        className="rating-label"
      >
        {t(customIcons[value as Value].label)}
      </Typography>
    </Box>
  )
}

export type SmileyFaceRatingProps = {
  value: string
  onChange: (_: number | null) => void
  readOnly?: boolean
}

export const SmileyFaceRating: React.FC<SmileyFaceRatingProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <Rating
      value={+value}
      onChange={(_, newValue) => onChange(newValue)}
      name="highlight-selected-only"
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
      size="large"
      readOnly={readOnly}
    />
  )
}
