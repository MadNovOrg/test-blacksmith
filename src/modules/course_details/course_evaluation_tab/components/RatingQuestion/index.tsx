import {
  Box,
  FormHelperText,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React from 'react'

import {
  SmileyFaceRating,
  SmileyFaceRatingProps,
} from '@app/modules/course_details/course_evaluation_tab/components/SmileyFaceRating'

type Props = {
  title: string
  error?: string
} & SmileyFaceRatingProps

export const RatingQuestion: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  error,
  ...rest
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      display="flex"
      bgcolor="common.white"
      px={2}
      py={1}
      mb={0.5}
      alignItems={isMobile ? 'left' : 'center'}
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <Box flex={1}>
        <Typography>{title}</Typography>
        {error && <FormHelperText error>{error}</FormHelperText>}
      </Box>

      <Box
        display="flex"
        flex={1}
        justifyContent={isMobile ? 'flex-start' : 'flex-end'}
        data-testid="course-evaluation-rating-question"
      >
        <SmileyFaceRating {...rest} />
      </Box>
    </Box>
  )
}
