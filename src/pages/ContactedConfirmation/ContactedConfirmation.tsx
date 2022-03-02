import { Box, Typography } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { Logo } from '@app/components/Logo'

export const ContactedConfirmationPage = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  return (
    <Box
      bgcolor="grey.200"
      width="100%"
      height="100%"
      p={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Logo size={80} />

      <Box
        mt={5}
        bgcolor="common.white"
        py={5}
        px={10}
        borderRadius={2}
        width={500}
        textAlign="center"
      >
        {email ? (
          <Typography data-testid="will-contact-you">
            We&apos;re aware you&apos;re having some issues, a member of our
            team will contact you at {email} as soon as possible
          </Typography>
        ) : (
          <Typography data-testid="will-contact-you">
            We have received your contact request and will reply as soon as
            possible
          </Typography>
        )}
      </Box>
    </Box>
  )
}
