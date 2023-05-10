import { formatInTimeZone } from 'date-fns-tz'

import { dateFormats } from '@app/i18n/config'
import common from '@app/i18n/en/common.json'
import { CourseLevel } from '@app/types'
import { getInitialsFromName } from '@app/util'

import { Course_Level_Enum_Short } from './enums'
import { AttendeesTableRow, Course, CourseTableRow, User } from './types'

const toUiTime = (date: Date) => {
  const tz = 'Etc/UTC'
  return `${formatInTimeZone(
    date,
    tz,
    dateFormats.date_defaultShort
  )}${formatInTimeZone(date, tz, dateFormats.date_onlyTime)}`
}

export const toCourseTableRow: (course: Course) => CourseTableRow = course => {
  const startUiTime = toUiTime(course.schedule[0].start)
  const endUiTime = toUiTime(course.schedule[0].end)
  const createdUiTime = toUiTime(course.createdAt ?? new Date())
  const { venue } = course.schedule[0] ?? {}
  const venueName = venue?.name ?? ''
  const venueCity = venue?.city ?? ''
  return {
    Name: `${course.name}${course.course_code}`,
    Venue: `${venueName}${venueCity}`,
    Type: `${common['course-types'][course.type]}${
      course.type == 'INDIRECT' ? 'Blended Learning' : ''
    }`,
    'Startsorted descending': startUiTime,
    End: endUiTime,
    Created: createdUiTime,
    'Trainer(s)':
      course.trainers
        ?.map(trainer => getInitialsFromName(trainer.profile.fullName))
        .join('') ?? '',
    Registrations: `${course.participants_aggregate?.aggregate?.count ?? 0}/${
      course.max_participants
    }`,
    Status: common['course-statuses'][course.status],
  }
}

export function toAttendeesTableRow({
  givenName,
  familyName,
  email,
  organization,
}: User): AttendeesTableRow {
  return {
    Name: `${givenName} ${familyName}`,
    Email: email,
    Organisation: organization?.name || '',
    Documents: 'View',
    '': 'SendResend course information',
  }
}

export function mapCourseTypesToShort(): Partial<
  Record<CourseLevel, Course_Level_Enum_Short>
> {
  return {
    [CourseLevel.Level_1]: Course_Level_Enum_Short.Level_1,
    [CourseLevel.Level_2]: Course_Level_Enum_Short.Level_2,
    [CourseLevel.Advanced]: Course_Level_Enum_Short.Advanced,
  }
}
