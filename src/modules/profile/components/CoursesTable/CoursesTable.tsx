import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
} from '@mui/material'
import { t } from 'i18next'
import { FC, PropsWithChildren, useMemo } from 'react'

import { useAuth } from '@app/context/auth'
import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { useSortedCoursesTableData } from '../../hooks/useSortedCoursesTable'
import { PROFILE_TABLE_ROW_SX, PROFILE_TABLE_SX } from '../../utils/common'
import { CourseParticipantAuditRow } from '../CourseParticipantAuditRow'
import { CourseParticipantRow } from '../CourseParticipantRow'

type CoursesTableProps = {
  profile: GetProfileDetailsQuery['profile']
}

export const CoursesTable: FC<PropsWithChildren<CoursesTableProps>> = ({
  profile,
}) => {
  const { acl } = useAuth()
  const { sortOrder, handleSortToggle, sortedData } = useSortedCoursesTableData(
    { profile },
  )

  const isInternalUser = useMemo(() => {
    return acl.isInternalUser()
  }, [acl])

  return (
    <Table data-testid="course-as-attendee" sx={{ mt: 1 }}>
      <TableHead>
        <TableRow sx={PROFILE_TABLE_SX}>
          <TableCell>{t('course-name')}</TableCell>
          <TableCell>{t('action')}</TableCell>
          <TableCell>
            <TableSortLabel
              active
              direction={sortOrder}
              onClick={handleSortToggle}
            >
              {t('date')}
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedData.map(row => {
          if (row.__typename === 'course_participant') {
            return (
              <CourseParticipantRow
                key={row.id}
                isInternalUser={isInternalUser}
                courseInfo={{
                  courseId: row.course.id,
                  courseName: row.course.name,
                  attended: row?.attended ?? undefined,
                  courseStartDate:
                    row?.course?.start.aggregate?.date?.start ?? '',
                  courseStatus: row?.course?.status ?? undefined,
                }}
              />
            )
          }

          if (row.__typename === 'course_participant_audit') {
            return (
              <CourseParticipantAuditRow
                key={row.id}
                isInternalUser={isInternalUser}
                courseInfo={{
                  courseId: row.course_id,
                  courseName: row.course.name,
                  courseStartDate:
                    row.course.dates.aggregate?.start?.date ?? '',
                  auditType: row.type,
                }}
              />
            )
          }
        })}

        {!sortedData.length && (
          <TableRow sx={PROFILE_TABLE_ROW_SX}>
            <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
              {t('pages.my-profile.no-course-history')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
