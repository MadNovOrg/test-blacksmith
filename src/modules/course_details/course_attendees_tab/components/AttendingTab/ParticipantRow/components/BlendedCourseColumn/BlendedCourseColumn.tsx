import { TableCell, Chip } from '@mui/material'
import { t } from 'i18next'
import { FC } from 'react'

import { CourseParticipant, BlendedLearningStatus } from '@app/types'

export const BlendedCourseColumn: FC<{
  isBlendedCourse: boolean
  participant: CourseParticipant
}> = ({ isBlendedCourse, participant }) => {
  if (!isBlendedCourse) return null

  return (
    <TableCell>
      {participant.go1EnrolmentStatus && (
        <Chip
          label={t(`blended-learning-status.${participant.go1EnrolmentStatus}`)}
          color={
            participant.go1EnrolmentStatus === BlendedLearningStatus.COMPLETED
              ? 'success'
              : 'warning'
          }
        />
      )}
    </TableCell>
  )
}
