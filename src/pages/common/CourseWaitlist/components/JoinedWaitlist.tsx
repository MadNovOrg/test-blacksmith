import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'

export const JoinedWaitlist: React.FC<
  React.PropsWithChildren<{ email: string }>
> = ({ email }) => {
  const { t } = useTranslation()

  return (
    <AppLayoutMinimal width={628}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Alert
          variant="outlined"
          color="success"
          sx={{ mb: 3 }}
          data-testid="success-alert"
        >
          {t('waitlist-added')}
        </Alert>

        <Typography
          variant="subtitle1"
          fontWeight="500"
          mb={2}
          textAlign="center"
        >
          {t('confirmation-email-sent', { email })}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={LinkBehavior}
          href="/"
        >
          {t('goto-tt')}
        </Button>
      </Box>
    </AppLayoutMinimal>
  )
}
