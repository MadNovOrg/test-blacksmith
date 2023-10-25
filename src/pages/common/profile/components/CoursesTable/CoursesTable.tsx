import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from '@mui/material'
import { format, isFuture, isPast } from 'date-fns'
import { t } from 'i18next'
import { matches } from 'lodash'
import { cond, constant, stubTrue } from 'lodash-es'
import { FC, PropsWithChildren, useCallback } from 'react'

import { useAuth } from '@app/context/auth'
import {
  Course_Participant_Audit_Type_Enum as ParticipantAuditType,
  Course_Status_Enum as CourseStatus,
  GetProfileDetailsQuery,
} from '@app/generated/graphql'

type CoursesTableProps = {
  profile: GetProfileDetailsQuery['profile']
}

export const CoursesTable: FC<PropsWithChildren<CoursesTableProps>> = ({
  profile,
}) => {
  const { acl } = useAuth()

  const mapCourseStatusToAction = useCallback(
    (
      course: {
        status?: CourseStatus | null
        start?: string
        end?: string
      },
      attended?: boolean | null
    ) => {
      const { status, start, end } = course

      if ([status, start, end].find(el => !el)) return null

      const startDate = start as string
      const endDate = end as string

      const time: 'past' | 'present' | 'future' = isPast(
        new Date(end as string)
      )
        ? 'past'
        : isFuture(new Date(start as string))
        ? 'future'
        : 'present'

      const mapCourseToAttendeeAction = cond([
        [
          matches({ active: false, isInternal: false }),
          constant({ label: 'Cancelled', showLink: false }),
        ],
        [
          matches({ active: false, isInternal: true }),
          constant({ label: 'Cancelled', showLink: true }),
        ],
        [
          matches({ active: true, attended: false }),
          constant({ label: 'Not Attended', showLink: true }),
        ],
        [
          matches({ active: true, attended: null }),
          constant({ label: 'Attending', showLink: true }),
        ],
        [
          matches({ active: true, attended: true }),
          constant({ label: 'Attended', showLink: true }),
        ],
        [
          matches({ active: true, attended: undefined }),
          constant({ label: 'Attending', showLink: true }),
        ],
        [stubTrue, constant(null)],
      ])

      if (
        ![
          CourseStatus.Cancelled,
          CourseStatus.Completed,
          CourseStatus.ConfirmModules,
          CourseStatus.Declined,
          CourseStatus.EvaluationMissing,
          CourseStatus.ExceptionsApprovalPending,
          CourseStatus.GradeMissing,
          CourseStatus.Scheduled,
          CourseStatus.TrainerDeclined,
          CourseStatus.TrainerMissing,
          CourseStatus.TrainerPending,
        ].includes(course.status as CourseStatus)
      )
        return null

      const active = ![CourseStatus.Cancelled, CourseStatus.Declined].includes(
        course.status as CourseStatus
      )

      return {
        course: mapCourseToAttendeeAction({
          active,
          attended,
          isInternal: acl.isInternalUser(),
        }),
        date: !active
          ? null
          : format(
              new Date(time === 'past' ? endDate : startDate),
              'd MMM yyyy'
            ),
      }
    },
    [acl]
  )

  const tableHeadCells = [t('course-name'), t('action'), t('date')]
  return (
    <Table data-testid="course-as-attendee" sx={{ mt: 1 }}>
      <TableHead>
        <TableRow
          sx={{
            '&&.MuiTableRow-root': {
              backgroundColor: 'grey.300',
            },
            '&& .MuiTableCell-root': {
              py: 1,
              color: 'grey.700',
              fontWeight: '600',
            },
          }}
        >
          {tableHeadCells.map(cell => (
            <TableCell key={cell}>{cell}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {profile?.participantAudits?.map(row => {
          return (
            <TableRow
              key={row.id}
              sx={{
                '&&.MuiTableRow-root': {
                  backgroundColor: 'common.white',
                },
              }}
              data-testid={`course-row-${row.course_id}`}
            >
              <TableCell data-testid="course-name">
                {[
                  ParticipantAuditType.Cancellation,
                  ParticipantAuditType.Replacement,
                  ParticipantAuditType.Transfer,
                ].includes(row.type) && !acl.isInternalUser() ? (
                  row.course.name
                ) : (
                  <Link href={`/courses/${row.course_id}/details`}>
                    {row.course.name}
                  </Link>
                )}
              </TableCell>
              <TableCell data-testid="course-action">
                {t(`participant-audit-types.${row.type}`)}
              </TableCell>
              <TableCell data-testid="course-date">
                {t('dates.defaultShort', {
                  date: row.course.dates.aggregate?.end?.date,
                })}
              </TableCell>
            </TableRow>
          )
        })}
        {profile?.courses.map(row => {
          if (!row) return null
          const attendeeAction = mapCourseStatusToAction(
            row.course,
            row.attended
          )

          return attendeeAction ? (
            <TableRow
              key={row.id}
              sx={{
                '&&.MuiTableRow-root': {
                  backgroundColor: 'common.white',
                },
              }}
            >
              <TableCell>
                {attendeeAction.course?.showLink ? (
                  <Link href={`/courses/${row.course.id}/details`}>
                    {row.course.name}
                  </Link>
                ) : (
                  row.course.name
                )}
              </TableCell>
              <TableCell>{attendeeAction.course?.label}</TableCell>
              <TableCell>{attendeeAction.date}</TableCell>
            </TableRow>
          ) : null
        })}

        {(profile?.participantAudits?.length ?? 0) +
          (profile?.courses.length || 0) <
        1 ? (
          <TableRow
            sx={{
              '&&.MuiTableRow-root': {
                backgroundColor: 'common.white',
              },
            }}
          >
            <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
              {t('pages.my-profile.no-course-history')}
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
