import { useMediaQuery } from '@mui/material'

import { SnackbarMessage } from '@app/components/SnackbarMessage'
import theme from '@app/theme'

export const SnackBars = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  if (!isMobile) return null
  return (
    <>
      <SnackbarMessage
        messageKey="course-created"
        sx={{ position: 'absolute' }}
      />
      <SnackbarMessage
        messageKey="course-canceled"
        severity="info"
        sx={{ position: 'absolute' }}
      />
      <SnackbarMessage
        messageKey="course-submitted"
        sx={{ position: 'absolute' }}
      />
      <SnackbarMessage
        messageKey="course-evaluated"
        sx={{ position: 'absolute' }}
      />
      <SnackbarMessage
        messageKey="participant-transferred"
        sx={{ position: 'absolute' }}
      />
    </>
  )
}
