import { Box } from '@mui/material'
import React from 'react'

type Props = unknown

export const Form: React.FC<Props> = () => {
  return (
    <Box
      component="form"
      onSubmit={() => console.log('TBD')}
      noValidate
      autoComplete="off"
      aria-autocomplete="none"
      mt={3}
    >
      Course booking page
    </Box>
  )
}
