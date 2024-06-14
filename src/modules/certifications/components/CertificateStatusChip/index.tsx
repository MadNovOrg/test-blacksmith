import { Box, Chip, ChipProps, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CertificateStatus } from '@app/generated/graphql'

export const colorsMap: Record<CertificateStatus, ChipProps['color']> = {
  [CertificateStatus.Active]: 'success',
  [CertificateStatus.OnHold]: 'warning',
  [CertificateStatus.Revoked]: 'critical',
  [CertificateStatus.Expired]: 'error',
  [CertificateStatus.ExpiredRecently]: 'error',
  [CertificateStatus.ExpiringSoon]: 'warning',
  [CertificateStatus.Inactive]: 'error',
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

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title={tooltip}>
        <Box display="flex" alignItems="center">
          <Chip
            label={t(`common.certification-status.${status?.toLowerCase()}`)}
            color={chipColor}
            size="small"
            {...rest}
          />
        </Box>
      </Tooltip>
    </Box>
  )
}
