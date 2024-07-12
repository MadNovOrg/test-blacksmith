import { Grid, Typography } from '@mui/material'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export const CertificateValid: React.FC<{
  expiryDate: string
}> = ({ expiryDate }) => {
  const { t, _t } = useScopedTranslation('common.course-certificate')
  return (
    <Grid item md={3} xs={12}>
      <Typography
        data-testid="certificate-valid-until"
        variant="body2"
        sx={{ mb: 1 }}
        color="grey.600"
      >
        {t('valid-until')}
      </Typography>
      <Typography variant="body1">
        {_t('dates.default', { date: expiryDate })}
      </Typography>
    </Grid>
  )
}
