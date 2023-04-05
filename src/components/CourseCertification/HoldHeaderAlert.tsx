import EditIcon from '@mui/icons-material/Edit'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Alert, Box, Button, Grid, Link, Typography } from '@mui/material'
import React from 'react'

import { useAuth } from '@app/context/auth'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CertificateStatus } from '@app/types'

export type HoldHeaderAlertProps = {
  status: CertificateStatus
  holdRequestStartDate: string
  holdRequestEndDate: string
  onEdit: () => void
  onView: () => void
}

const HoldHeaderAlert: React.FC<React.PropsWithChildren<HoldHeaderAlertProps>> =
  function ({
    status,
    holdRequestStartDate,
    holdRequestEndDate,
    onEdit,
    onView,
  }) {
    const { t } = useScopedTranslation('common.course-certificate')
    const { acl } = useAuth()

    return (
      <Grid item mb={2}>
        <Alert
          variant="outlined"
          data-testid="on-hold-alert"
          color="warning"
          sx={{
            my: 2,
            alignItems: 'center',
            '&& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="body2" color="grey.900">
                {t(
                  status === CertificateStatus.ON_HOLD
                    ? 'on-hold-warning'
                    : 'on-hold-planned-warning',
                  {
                    startDate: holdRequestStartDate,
                    expireDate: holdRequestEndDate,
                  }
                )}
              </Typography>
              {!acl.canManageCert() && (
                <Typography variant="body2" color="grey.900">
                  {t('on-hold-contact-us')}
                  <Link href="mailto:info@teamteach.co.uk" component="a">
                    info@teamteach.co.uk
                  </Link>
                </Typography>
              )}
            </Box>
            {acl.canManageCert() && (
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="text"
                  startIcon={<RemoveRedEyeIcon />}
                  sx={{ ml: 1, py: 0 }}
                  size="small"
                  onClick={onView}
                  data-testid="view-details"
                >
                  {t('view-details')}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{ ml: 1, py: 0 }}
                  size="small"
                  data-testid="edit-hold-status-button"
                  onClick={onEdit}
                >
                  {t('edit')}
                </Button>
              </Box>
            )}
          </Box>
        </Alert>
      </Grid>
    )
  }

export default HoldHeaderAlert
