import { Chip, TableCell, TableRow } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { ParticipantsCount } from '@app/components/ParticipantsCount'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { useAuth } from '@app/context/auth'
import { Course_Status_Enum, TrainerCoursesQuery } from '@app/generated/graphql'
import { Course_Invite_Status_Enum } from '@app/generated/graphql'
import { useTableSort } from '@app/hooks/useTableSort'
import { findCourseTrainer } from '@app/util'

import { AcceptDeclineCourse, Trainer } from '../AcceptDeclineCourse'
import {
  CoursesTable,
  CourseTitleCell,
  DateCell,
  VenueCell,
  TableCourse,
} from '../CoursesTable'

type ActionableCoursesTableProps = {
  actionableCourses: TrainerCoursesQuery
  fetchingActionableCourses: boolean
  onAcceptedOrDeclined: (
    course: TableCourse,
    trainer: Trainer,
    status: Course_Invite_Status_Enum
  ) => void
  sorting?: ReturnType<typeof useTableSort>
}

export const ActionableCoursesTable: React.FC<ActionableCoursesTableProps> = ({
  actionableCourses,
  fetchingActionableCourses,
  onAcceptedOrDeclined,
  sorting,
}) => {
  const { t } = useTranslation()
  const { profile } = useAuth()

  return (
    <CoursesTable
      courses={actionableCourses?.courses}
      hiddenColumns={new Set(['status'])}
      data-testid="actionable-courses-table"
      loading={fetchingActionableCourses}
      sorting={sorting}
      renderRow={(course: TableCourse, index?: number) => (
        <TableRow
          key={course.id}
          className="MyCoursesRow"
          data-testid={`actionable-course-${course.id}`}
          data-index={index}
        >
          <CourseTitleCell course={course} />
          <VenueCell course={course} />
          <TableCell>{t(`course-types.${course.type}`)}</TableCell>
          <DateCell date={course.dates?.aggregate?.start?.date} />
          <DateCell date={course.dates?.aggregate?.end?.date} />
          <DateCell date={course.createdAt} />
          <TableCell>
            <TrainerAvatarGroup trainers={course.trainers} />
          </TableCell>
          <TableCell data-testid="participants-cell">
            <ParticipantsCount
              participating={course.participantsAgg?.aggregate?.count ?? 0}
              capacity={course.max_participants}
              waitlist={course.waitlistAgg?.aggregate?.count}
            />
          </TableCell>
          <TableCell>
            {course.status === Course_Status_Enum.TrainerPending ? (
              <AcceptDeclineCourse
                trainer={
                  profile
                    ? findCourseTrainer(course.trainers, profile.id)
                    : undefined
                }
                onUpdate={(trainer, status) =>
                  onAcceptedOrDeclined(course, trainer, status)
                }
              />
            ) : null}
            {course.status &&
            [
              Course_Status_Enum.ApprovalPending,
              Course_Status_Enum.ExceptionsApprovalPending,
            ].indexOf(course.status) !== -1 ? (
              <CourseStatusChip status={course.status} hideIcon={true} />
            ) : null}
            {course.status === Course_Status_Enum.TrainerMissing ? (
              <CourseStatusChip status={course.status} />
            ) : null}
            {course.cancellationRequest ? (
              <Chip
                size="small"
                color="warning"
                label={t('common.cancellation-requested')}
              />
            ) : null}
          </TableCell>
        </TableRow>
      )}
    />
  )
}
