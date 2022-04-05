import { Box, FormHelperText, Typography } from '@mui/material'
import React from 'react'

type Props = {
  title: string
  description?: string
  error?: string
}

export const QuestionGroup: React.FC<Props> = ({
  title,
  description,
  error,
  children,
}) => {
  return (
    <Box mb={5}>
      <Typography variant="subtitle2">{title}</Typography>

      {description ? (
        <Typography variant="body1" color="grey.600" gutterBottom>
          {description}
        </Typography>
      ) : null}

      {error ? <FormHelperText error>{error}</FormHelperText> : null}

      <Box
        display="flex"
        flexDirection="column"
        borderRadius={2}
        position="relative"
      >
        {children}
      </Box>
    </Box>
  )
}
