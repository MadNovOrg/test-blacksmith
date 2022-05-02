/* eslint-disable no-empty-pattern */
import { test } from '@playwright/test'

import { CourseStatus, CourseType, InviteStatus } from '@app/types'

import {
  getTrainerCourses,
  insertCourse,
  deleteCourse,
  insertCourseModules,
  getModuleIds,
  insertCourseParticipants,
  makeSureTrainerHasCourses,
} from '../api/hasura-api'
import { COURSES_TO_VIEW, UNIQUE_COURSE } from '../data/courses'
import { getModulesByLevel } from '../data/modules'
import { users } from '../data/users'

test('insert test @data', async () => {
  test.skip(!process.env.TRAINER)
  test.setTimeout(120000)
  const email = process.env.TRAINER ?? ''

  // delete all trainer's courses
  const courses = await getTrainerCourses(email)
  for (const course of courses) {
    await deleteCourse(course.id)
  }

  // add some pending courses
  await makeSureTrainerHasCourses(COURSES_TO_VIEW, email)

  // add courses in the past with participants
  for (let i = 0; i < 3; i++) {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.organization = { name: 'London First School' }
    course.status = CourseStatus.PUBLISHED
    course.schedule[0].start = new Date('2022-03-15T09:00:00Z')
    course.schedule[0].end = new Date('2022-03-15T16:00:00Z')
    course.id = await insertCourse(course, email, InviteStatus.ACCEPTED)

    const moduleIds = await getModuleIds(
      getModulesByLevel(course.level),
      course.level
    )
    await insertCourseModules(course.id, moduleIds)
    await insertCourseParticipants(
      course.id,
      [users.user1WithOrg, users.user2WithOrg],
      new Date('2022-03-14T00:00:00Z')
    )
  }
})
