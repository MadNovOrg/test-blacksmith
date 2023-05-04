import { formatInTimeZone } from 'date-fns-tz'

import { dateFormats } from '@app/i18n/config'
import common from '@app/i18n/en/common.json'
import { getInitialsFromName } from '@app/util'

import { AttendeesTableRow, Course, CourseTableRow, User } from './types'

const toUiTime = (date: Date) => {
  const tz = 'Etc/UTC'
  return `${formatInTimeZone(
    date,
    tz,
    dateFormats.date_defaultShort
  )}${formatInTimeZone(date, tz, dateFormats.date_onlyTime)}`
}

export const toCourseTableRow: (
  course: Course
) => Promise<CourseTableRow> = async course => {
  const startUiTime = toUiTime(course.schedule[0].start)
  const endUiTime = toUiTime(course.schedule[0].end)
  const { venue } = course.schedule[0] ?? {}
  const venueName = venue?.name ?? ''
  const venueCity = venue?.city ?? ''
  return {
    Name: `${course.name}${course.course_code}`,
    Venue: `${venueName}${venueCity}`,
    Type: common['course-types'][course.type],
    'Startsorted descending': startUiTime,
    End: endUiTime,
    Status: common['course-statuses'][course.status],
    'Trainer(s)':
      course.trainers
        ?.map(trainer => getInitialsFromName(trainer.profile.fullName))
        .join('') ?? '',
    Registrations: `${course.participants_aggregate?.aggregate?.count}/${course.max_participants}`,
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
