import { Box, Chip, ChipProps, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Certificate_Status_Enum } from '@app/generated/graphql'

export const colorsMap: Record<Certificate_Status_Enum, ChipProps['color']> = {
  [Certificate_Status_Enum.Active]: 'success',
  [Certificate_Status_Enum.OnHold]: 'warning',
  [Certificate_Status_Enum.Revoked]: 'critical',
  [Certificate_Status_Enum.Expired]: 'error',
  [Certificate_Status_Enum.ExpiredRecently]: 'error',
  [Certificate_Status_Enum.ExpiringSoon]: 'warning',
  [Certificate_Status_Enum.Inactive]: 'error',
} as const

type Props = {
  status: Certificate_Status_Enum
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
