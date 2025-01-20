import { Alert, Box, Typography, useTheme } from '@mui/material'
import { isPast } from 'date-fns'
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { GetProfileDetailsQuery } from '@app/generated/graphql'

type CertificationsAlertsProps = {
  certificate: GetProfileDetailsQuery['certificates'][0]
  index: number
}
export const CertificationsAlerts: FC<
  PropsWithChildren<CertificationsAlertsProps>
> = ({ certificate, index }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const CertificateExpiryAlert = () => {
    if (isPast(new Date(certificate.expiryDate))) {
      return (
        <Alert
          data-testid="expired-certificate-alert"
          severity={index === 0 ? 'error' : 'info'}
          sx={{ mt: 1 }}
        >
          {t('course-certificate.expired-on', {
            date: certificate.expiryDate,
          })}
        </Alert>
      )
    }
    return (
      <Alert
        data-testid="valid-certificate-alert"
        variant="outlined"
        severity="success"
        sx={{ mt: 1 }}
      >
        {t('course-certificate.active-until', {
          date: certificate.expiryDate,
        })}
      </Alert>
    )
  }

  return (
    <Box
      mt={2}
      bgcolor="common.white"
      p={3}
      borderRadius={1}
      key={certificate.id}
    >
      <Typography color={theme.palette.grey[700]} fontWeight={600}>
        {certificate.courseName}
      </Typography>

      <Typography color={theme.palette.grey[700]} mt={1}>
        {certificate.number}
      </Typography>

      {certificate.expiryDate ? <CertificateExpiryAlert /> : null}
    </Box>
  )
}
