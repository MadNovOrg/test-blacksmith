import WarningIcon from '@mui/icons-material/Warning'
import { Box, Chip, ChipProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CertificateStatus } from '@app/types'

export const colorsMap: Record<CertificateStatus, ChipProps['color']> = {
  [CertificateStatus.EXPIRED]: 'error',
  [CertificateStatus.EXPIRED_RECENTLY]: 'gray',
  [CertificateStatus.EXPIRING_SOON]: 'warning',
  [CertificateStatus.ACTIVE]: 'success',
  [CertificateStatus.ON_HOLD]: 'warning',
  [CertificateStatus.REVOKED]: 'perfume',
} as const

type Props = {
  status: CertificateStatus
} & ChipProps

export const CertificateStatusChip: React.FC<
  React.PropsWithChildren<Props>
> = ({ status, ...rest }) => {
  const { t } = useTranslation()

  const chipColor = colorsMap[status]
  const isRevoked = status === CertificateStatus.REVOKED

  return (
    <Box display="flex" alignItems="center">
      <Chip
        label={t(`common.certification-status.${status.toLowerCase()}`)}
        color={chipColor}
        size="small"
        {...rest}
      />
      {isRevoked && <WarningIcon sx={{ ml: 0.5 }} color="neonBlue" />}
    </Box>
  )
}
