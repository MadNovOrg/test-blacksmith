import { Chip, SxProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseStatus } from '@app/types'

type StatusChipProps = {
  status: CourseStatus
  type: StatusChipType
  sx?: SxProps
  [x: string]: unknown
}
export enum StatusChipType {
  COURSE,
}

/* TODO: finalize color */
const colors = {
  [StatusChipType.COURSE]: {
    [CourseStatus.DRAFT]: 'warning',
    [CourseStatus.PENDING]: 'secondary',
    [CourseStatus.PUBLISHED]: 'success',
  },
} as const

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  type,
  sx,
  children: _children,
  ...rest
}) => {
  const { t } = useTranslation()

  return (
    <Chip
      label={t(`course-statuses.${status}`)}
      color={colors[type][status]}
      size="small"
      sx={sx}
      {...rest}
    />
  )
}
