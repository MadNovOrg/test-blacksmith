import { TableCell } from '@mui/material'
import { t } from 'i18next'
import { FC, useMemo } from 'react'

import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { CourseParticipant } from '@app/types'

export const EvaluationColumn: FC<{
  participant: CourseParticipant
  courseType: Course_Type_Enum
}> = ({ participant, courseType }) => {
  const {
    acl: {
      canViewOpenCourseEvaluationSubmitted,
      canViewClosedCourseEvaluationSubmitted,
      canViewIndirectCourseEvaluationSubmitted,
    },
  } = useAuth()
  const canViewEvaluationSubmittedColumn = useMemo(() => {
    switch (courseType) {
      case Course_Type_Enum.Open:
        return canViewOpenCourseEvaluationSubmitted()
      case Course_Type_Enum.Closed:
        return canViewClosedCourseEvaluationSubmitted()
      case Course_Type_Enum.Indirect:
        return canViewIndirectCourseEvaluationSubmitted()
      default:
        return false
    }
  }, [
    canViewOpenCourseEvaluationSubmitted,
    courseType,
    canViewClosedCourseEvaluationSubmitted,
    canViewIndirectCourseEvaluationSubmitted,
  ])

  if (!canViewEvaluationSubmittedColumn) return null

  return (
    <TableCell style={{ textAlign: 'center' }}>
      {participant.completed_evaluation &&
      (participant.profile.course_evaluation_answers_aggregate?.aggregate
        .count ?? 0) > 0
        ? t('common.yes')
        : t('common.no')}
    </TableCell>
  )
}
