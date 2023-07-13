import { Button, Box, Typography, useTheme, SxProps, Link } from '@mui/material'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

type Props = {
  sx?: SxProps
}

export const RequestAQuoteBanner: React.FC<Props> = ({ sx = {} }) => {
  const theme = useTheme()
  const { t } = useTranslation()

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
            email: import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS,
          }}
        >
          <Box sx={{ whiteSpace: 'nowrap' }} component="span" />
          <Link
            href={`mailto:${import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS}`}
            component="a"
          />
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
