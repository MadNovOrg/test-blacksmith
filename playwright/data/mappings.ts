import translation from '@app/i18n/en/translation.json'
import { getInitialsFromName } from '@app/util'

import { AttendeesTableRow, Course, CourseTableRow, User } from './types'

const toUiTime = (date: Date) => {
  return date
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    })
    .replace(', ', '')
    .replace('am', 'AM')
    .replace('pm', 'PM')
}

export const toCourseTableRow: (course: Course) => CourseTableRow = course => {
  const startUiTime = toUiTime(course.schedule[0].start)
  const endUiTime = toUiTime(course.schedule[0].end)
  return {
    Name: `${translation.common['course-levels'][course.level]}${course.name}`,
    Venue: course.schedule[0].venue
      ? `${course.schedule[0].venue.name}${course.schedule[0].venue.city}`
      : '',
    Type: translation.common['course-types'][course.type],
    Start: startUiTime,
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
