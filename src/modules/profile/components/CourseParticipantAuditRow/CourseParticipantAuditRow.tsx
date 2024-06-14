import { Link, TableCell, TableRow } from '@mui/material'
import { t } from 'i18next'

import { Course_Participant_Audit_Type_Enum as ParticipantAuditType } from '@app/generated/graphql'

import { PROFILE_TABLE_ROW_SX } from '../../utils/common'

interface Props {
  isInternalUser: boolean
  courseInfo: {
    courseId: number
    courseName: string
    courseStartDate: string
    auditType: ParticipantAuditType
  }
}

export const CourseParticipantAuditRow = ({
  isInternalUser,
  courseInfo,
}: Props) => {
  const { courseId, courseName, courseStartDate, auditType } = courseInfo

  const shouldShowLink =
    [
      ParticipantAuditType.Cancellation,
      ParticipantAuditType.Replacement,
      ParticipantAuditType.Transfer,
    ].includes(auditType) && !isInternalUser

  return (
    <TableRow sx={PROFILE_TABLE_ROW_SX} data-testid={`course-row-${courseId}`}>
      <TableCell data-testid="course-name">
        {shouldShowLink ? (
          <Link href={`/courses/${courseId}/details`}>{courseName}</Link>
        ) : (
          courseName
        )}
      </TableCell>
      <TableCell data-testid="course-action">
        {t(`participant-audit-types.${auditType}`)}
      </TableCell>
      <TableCell data-testid="course-date">
        {t('dates.defaultShort', {
          date: courseStartDate,
        })}
      </TableCell>
    </TableRow>
  )
}
