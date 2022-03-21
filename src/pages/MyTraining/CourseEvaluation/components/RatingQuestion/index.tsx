import React from 'react'
import { Box, FormHelperText, Typography } from '@mui/material'

import {
  SmileyFaceRating,
  SmileyFaceRatingProps,
} from '@app/components/SmileyFaceRating'

type Props = {
  title: string
  error?: string
} & SmileyFaceRatingProps

export const RatingQuestion: React.FC<Props> = ({ title, error, ...rest }) => {
  return (
    <Box
      display="flex"
      bgcolor="common.white"
      px={2}
      py={1}
      mb={0.5}
      alignItems="center"
    >
      <Box flex={1}>
        <Typography>{title}</Typography>
        {error && <FormHelperText error>{error}</FormHelperText>}
      </Box>

      <Box display="flex" flex={1} justifyContent="flex-end">
        <SmileyFaceRating {...rest} />
      </Box>
    </Box>
  )
}
