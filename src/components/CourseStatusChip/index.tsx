import { Warning } from '@mui/icons-material'
import { Box, Chip, ChipProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Status_Enum } from '@app/generated/graphql'
import {
  AdminOnlyCourseStatus,
  AllCourseStatuses,
  AttendeeOnlyCourseStatus,
} from '@app/types'

const colorsMap: Record<AllCourseStatuses, ChipProps['color']> = {
  [Course_Status_Enum.Cancelled]: 'default',
  [Course_Status_Enum.Completed]: 'success',
  [Course_Status_Enum.ConfirmModules]: 'warning',
  [Course_Status_Enum.Declined]: 'default',
  [Course_Status_Enum.Draft]: 'error',
  [Course_Status_Enum.EvaluationMissing]: 'warning',
  [Course_Status_Enum.GradeMissing]: 'warning',
  [Course_Status_Enum.Scheduled]: 'info',
  [Course_Status_Enum.TrainerPending]: 'warning',
  [Course_Status_Enum.TrainerDeclined]: 'warning',
  [Course_Status_Enum.VenueMissing]: 'warning',
  [Course_Status_Enum.TrainerMissing]: 'info',
  [Course_Status_Enum.ExceptionsApprovalPending]: 'warning',
  [AttendeeOnlyCourseStatus.InfoRequired]: 'warning',
  [AttendeeOnlyCourseStatus.NotAttended]: 'default',
  [AttendeeOnlyCourseStatus.AwaitingGrade]: 'default',
  [AdminOnlyCourseStatus.CancellationRequested]: 'warning',
}

type Props = {
  status: AllCourseStatuses
  hideIcon?: boolean
  color?: ChipProps['color']
} & ChipProps

export const CourseStatusChip: React.FC<React.PropsWithChildren<Props>> = ({
  status,
  hideIcon = false,
  color,
  ...rest
}) => {
  const { t } = useTranslation()

  const chipColor = color ?? colorsMap[status]

  return (
    <Box display="flex">
      <Chip
        {...rest}
        size="small"
        color={chipColor}
        label={t(`course-statuses.${status}`)}
        sx={{ marginRight: chipColor === 'warning' ? 1 : 0 }}
        data-testid="course-status-chip"
      />
      {chipColor === 'warning' && !hideIcon ? (
        <Warning color="warning" />
      ) : null}
    </Box>
  )
}
