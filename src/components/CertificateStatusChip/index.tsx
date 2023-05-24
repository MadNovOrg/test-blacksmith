import WarningIcon from '@mui/icons-material/Warning'
import { Box, Chip, ChipProps, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CertificateStatus } from '@app/types'

export const colorsMap: Record<CertificateStatus, ChipProps['color']> = {
  [CertificateStatus.ACTIVE]: 'success',
  [CertificateStatus.ON_HOLD]: 'warning',
  [CertificateStatus.REVOKED]: 'critical',
  [CertificateStatus.EXPIRED]: 'gray',
  [CertificateStatus.EXPIRED_RECENTLY]: 'gray',
  [CertificateStatus.EXPIRING_SOON]: 'warning',
} as const

type Props = {
  status: CertificateStatus
  tooltip?: string
} & ChipProps

export const CertificateStatusChip: React.FC<
  React.PropsWithChildren<Props>
> = ({ status, tooltip, ...rest }) => {
  const { t } = useTranslation()

  const chipColor = colorsMap[status]
  const isRevoked = status === CertificateStatus.REVOKED
  const isOnHold = status === CertificateStatus.ON_HOLD

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title={tooltip}>
        <Box display="flex" alignItems="center">
          <Chip
            label={t(`common.certification-status.${status.toLowerCase()}`)}
            color={chipColor}
            size="small"
            {...rest}
          />
          {(isRevoked || isOnHold) && (
            <WarningIcon
              color={isRevoked ? 'error' : 'warning'}
              sx={{ marginLeft: '0.2em' }}
            />
          )}
        </Box>
      </Tooltip>
    </Box>
  )
}
