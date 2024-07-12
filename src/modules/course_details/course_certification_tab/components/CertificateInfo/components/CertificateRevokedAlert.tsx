import { Alert, Box } from '@mui/material'

import { useAuth } from '@app/context/auth'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { AdminViewButton } from './ViewDetailsButton'

export const CertificateRevokedAlert: React.FC<{
  revokedDate: string
  onShowChangelogModal: VoidFunction
}> = ({ revokedDate, onShowChangelogModal }) => {
  const { acl } = useAuth()
  const { t } = useScopedTranslation('common.course-certificate')
  return (
    <Alert
      severity="warning"
      sx={{
        mb: 2,
        '&& .MuiAlert-message': {
          width: '100%',
        },
      }}
      variant="outlined"
      data-testid="revoked-cert-alert"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {t('revoked-warning', { date: revokedDate })}
        {acl.isTTAdmin() ? (
          <AdminViewButton onShowChangelogModal={onShowChangelogModal} />
        ) : null}
      </Box>
    </Alert>
  )
}
