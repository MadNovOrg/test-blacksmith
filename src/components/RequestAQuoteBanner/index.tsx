import { Button, Box, Typography, useTheme, SxProps, Link } from '@mui/material'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { useAuth } from '@app/context/auth'

type Props = {
  sx?: SxProps
}

export const RequestAQuoteBanner: React.FC<Props> = ({ sx = {} }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { acl } = useAuth()

  const infoEmailAddress = acl.isUK()
    ? import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS
    : import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS_ANZ
  return (
    <Box
      sx={{
        bgcolor: theme.colors.navy[100],
        borderRadius: 1,
        p: 2,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Typography variant="h4">
        {t('components.request-a-quote.looking-for-private-course')}
      </Typography>

      <Typography sx={{ mt: 1, fontSize: theme.typography.body2.fontSize }}>
        <Trans
          i18nKey="components.request-a-quote.more-info"
          t={t}
          values={{
            email: infoEmailAddress,
          }}
        >
          <Box sx={{ whiteSpace: 'nowrap' }} component="span" />
          <Link href={`mailto:${infoEmailAddress}`} component="a" />
        </Trans>
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        target="_blank"
        href={import.meta.env.VITE_REQUEST_QUOTE_URL}
      >
        {t('components.request-a-quote.enquire-now')}
      </Button>
    </Box>
  )
}
