import { Warning } from '@mui/icons-material'
import { Box, Chip, ChipProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Status_Enum } from '@app/generated/graphql'
import { AttendeeOnlyCourseStatus } from '@app/types'

type AllCourseStatuses = Course_Status_Enum | AttendeeOnlyCourseStatus

const colorsMap: Record<AllCourseStatuses, ChipProps['color']> = {
  [Course_Status_Enum.ApprovalPending]: 'warning',
  [Course_Status_Enum.Cancelled]: 'default',
  [Course_Status_Enum.Completed]: 'success',
  [Course_Status_Enum.ConfirmModules]: 'warning',
  [Course_Status_Enum.Declined]: 'default',
  [Course_Status_Enum.Draft]: 'error',
  [Course_Status_Enum.EvaluationMissing]: 'warning',
  [Course_Status_Enum.GradeMissing]: 'warning',
  [Course_Status_Enum.Scheduled]: 'info',
  [Course_Status_Enum.TrainerPending]: 'warning',
  [Course_Status_Enum.TrainerUnavailable]: 'warning',
  [AttendeeOnlyCourseStatus.InfoRequired]: 'warning',
  [AttendeeOnlyCourseStatus.NotAttended]: 'default',
}

type Props = {
  status: AllCourseStatuses
} & ChipProps

export const CourseStatusChip: React.FC<Props> = ({ status, ...rest }) => {
  const { t } = useTranslation()

  const chipColor = colorsMap[status]

  return (
    <Box display="flex">
      <Chip
        {...rest}
        size="small"
        color={chipColor}
        label={t(`course-statuses.${status}`)}
        sx={{ marginRight: chipColor === 'warning' ? 1 : 0 }}
      />
      {chipColor === 'warning' ? <Warning color="warning" /> : null}
    </Box>
  )
}
