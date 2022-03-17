import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const MembershipDetailsPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('pages.membership.details.title')}
        </Typography>
      </Box>
    </Container>
  )
}
