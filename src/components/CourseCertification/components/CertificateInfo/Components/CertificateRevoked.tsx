import { Grid, Typography } from '@mui/material'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export const CertificateRevoked: React.FC<{
  revokedDate: string
}> = ({ revokedDate }) => {
  const { t, _t } = useScopedTranslation('common.course-certificate')
  return (
    <Grid item md={3} xs={12}>
      <Typography variant="body2" sx={{ mb: 1 }} color="grey.600">
        {t('revoked-on')}
      </Typography>
      <Typography variant="body1">
        {_t('dates.default', { date: revokedDate })}
      </Typography>
    </Grid>
  )
}
