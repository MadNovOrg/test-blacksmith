import { formatInTimeZone } from 'date-fns-tz'

import { dateFormats } from '@app/i18n/config'
import translation from '@app/i18n/en/translation.json'
import { getInitialsFromName } from '@app/util'

import { AttendeesTableRow, Course, CourseTableRow, User } from './types'

const toUiTime = (date: Date) => {
  const tz = 'Etc/UTC'

  return `${formatInTimeZone(
    date,
    tz,
    dateFormats.date_short
  )}${formatInTimeZone(date, tz, dateFormats.date_onlyTime)}`
}

export const toCourseTableRow: (course: Course) => CourseTableRow = course => {
  const startUiTime = toUiTime(course.schedule[0].start)
  const endUiTime = toUiTime(course.schedule[0].end)
  return {
    Name: `${course.name}${course.course_code}`,
    Venue: course.schedule[0].venue
      ? `${course.schedule[0].venue.name}${course.schedule[0].venue.city}`
      : '',
    Type: translation.common['course-types'][course.type],
    'Startsorted descending': startUiTime,
    End: endUiTime,
    Status: translation.common['course-statuses'][course.status],
    'Trainer(s)':
      course.trainers
        ?.map(trainer => getInitialsFromName(trainer.profile.fullName))
        .join('') ?? '',
    'Regist.': `${course.participants_aggregate?.aggregate?.count}/${course.max_participants}`,
  }
}

export const toAttendeesTableRow: (user: User) => AttendeesTableRow = user => ({
  Name: `${user.givenName} ${user.familyName}`,
  Contact: user.email,
  Organisation: user.organization ? user.organization.name : '',
  Documents: 'View',
})
