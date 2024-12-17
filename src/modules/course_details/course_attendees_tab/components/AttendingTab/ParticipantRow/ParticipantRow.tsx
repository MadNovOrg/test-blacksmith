import { TableRow, TableCell, Typography, Link } from '@mui/material'
import { t } from 'i18next'
import { FC } from 'react'

import { useAuth } from '@app/context/auth'
import { Scalars } from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import { LinkToProfile } from '@app/modules/profile/components/LinkToProfile'
import { Course, CourseParticipant } from '@app/types'
import { courseStarted } from '@app/util'

import { useCanToggleParticipantAttendance } from '../hooks'
import { getAttendanceDisabled } from '../utils'

import {
  BlendedCourseColumn,
  EvaluationColumn,
  OrdersColumn,
  ToggleAttendanceColumn,
} from './components'
import { ActionsColumn } from './components/ActionsColumn/ActionsColumn'

type ParticipantRowProps = {
  participant: CourseParticipant
  isSelected: (id: string) => boolean
  checkbox: ReturnType<typeof useTableChecks>['checkbox']
  course: Course
}

export const ParticipantRow: FC<ParticipantRowProps> = ({
  participant,
  isSelected,
  checkbox,
  course,
}) => {
  const {
    acl: { canGradeParticipants, canViewOrganizations },
  } = useAuth()

  const canToggleAttendance =
    canGradeParticipants(course.trainers ?? []) && courseStarted(course)

  const isAttendanceDisabled = getAttendanceDisabled(course.status)
  const canToggleParticipantAttendance = useCanToggleParticipantAttendance(
    canToggleAttendance,
    isAttendanceDisabled,
  )

  return (
    <TableRow
      key={participant.id}
      data-testid={`course-participant-row-${participant.id}`}
      sx={{
        backgroundColor: isSelected(participant.id) ? 'grey.50' : '',
      }}
    >
      {checkbox.rowCell(
        participant.id,
        !canToggleParticipantAttendance(participant),
      )}
      <TableCell>
        <LinkToProfile
          profileId={participant.profile.id}
          isProfileArchived={participant.profile.archived}
          courseId={course.id}
        >
          {participant.profile.archived
            ? t('common.archived-profile')
            : participant.profile.fullName}
        </LinkToProfile>
      </TableCell>
      <TableCell>
        <LinkToProfile
          profileId={participant.profile.id}
          isProfileArchived={participant.profile.archived}
          courseId={course.id}
        >
          {participant.profile.email}
          {participant.profile.contactDetails.map(
            (contact: Scalars['jsonb']) => contact.value,
          )}
        </LinkToProfile>
      </TableCell>
      <TableCell>
        {participant.profile.organizations.map(org =>
          canViewOrganizations() ? (
            <Link
              href={`/organisations/${org.organization.id}`}
              key={org.organization.id}
            >
              <Typography>{org.organization.name}</Typography>
            </Link>
          ) : (
            <Typography key={org.organization.id}>
              {org.organization.name}
            </Typography>
          ),
        )}
      </TableCell>
      <BlendedCourseColumn
        isBlendedCourse={course.go1Integration}
        participant={participant}
      />
      <TableCell style={{ textAlign: 'center' }}>
        {participant.healthSafetyConsent ? t('common.yes') : t('common.no')}
      </TableCell>
      <EvaluationColumn participant={participant} courseType={course.type} />
      <ToggleAttendanceColumn participant={participant} course={course} />
      <OrdersColumn participant={participant} course={course} />
      <ActionsColumn participant={participant} course={course} />
    </TableRow>
  )
}
