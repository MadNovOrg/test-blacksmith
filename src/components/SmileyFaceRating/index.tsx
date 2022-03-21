import React from 'react'
import Rating from '@mui/material/Rating'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import { Box, IconContainerProps, Typography } from '@mui/material'

// TODO: i18n
const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon fontSize="inherit" />,
    label: 'Poor',
  },
  2: {
    icon: <SentimentDissatisfiedIcon fontSize="inherit" />,
    label: 'Fair',
  },
  3: {
    icon: <SentimentSatisfiedIcon fontSize="inherit" />,
    label: 'Average',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon fontSize="inherit" />,
    label: 'Good',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon fontSize="inherit" />,
    label: 'Excellent',
  },
}

type Value = keyof typeof customIcons

const IconContainer: React.FC<IconContainerProps> = ({
  value,
  className,
  ...rest
}) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    p={0.5}
    fontSize={50}
    className={`${className} rating-${value}`}
    {...rest}
  >
    {customIcons[value as Value].icon}
    <Typography
      color="common.black"
      variant="caption"
      fontWeight="500"
      className="rating-label"
    >
      {customIcons[value as Value].label}
    </Typography>
  </Box>
)

export type SmileyFaceRatingProps = {
  value: string
  onChange: (_: number | null) => void
}

export const SmileyFaceRating: React.FC<SmileyFaceRatingProps> = ({
  value,
  onChange,
}) => {
  return (
    <Rating
      value={+value}
      onChange={(_, newValue) => onChange(newValue)}
      name="highlight-selected-only"
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
      size="large"
    />
  )
}
