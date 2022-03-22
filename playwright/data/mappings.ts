import translation from '../../src/i18n/en/translation.json'

import { Course, CourseTableRow } from './types'

const statusActions = {
  PENDING: 'Build',
  DRAFT: 'Build',
  PUBLISHED: 'Manage',
}

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
    'Course Name': `${translation.common['course-levels'][course.level]}${
      course.name
    }`,
    Organization: course.organization ? course.organization.name : '',
    'Course Type': translation.common['course-types'][course.type],
    Start: startUiTime,
    End: endUiTime,
    Status: translation.common['course-statuses'][course.status],
    '': statusActions[course.status],
  }
}
