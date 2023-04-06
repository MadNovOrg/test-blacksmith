import { test } from '@playwright/test'

import { Course_Status_Enum, Course_Source_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import * as API from '../api'
import { COURSES_TO_VIEW, UNIQUE_COURSE } from '../data/courses'
import { users } from '../data/users'

test('insert test @data', async () => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(!process.env.TRAINER)
  test.setTimeout(120000)
  // eslint-disable-next-line playwright/no-conditional-in-test
  const email = process.env.TRAINER ?? ''

  // delete all trainer's courses
  const courses = await API.course.getTrainerCourses(email)
  for (const course of courses) {
    await API.course.deleteCourse(course.id)
  }

  // add some pending courses
  await API.course.makeSureTrainerHasCourses(COURSES_TO_VIEW, email)

  // add courses in the past with participants
  for (let i = 0; i < 3; i++) {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.source = Course_Source_Enum.EmailEnquiry
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.Scheduled
    course.schedule[0].start = new Date('2022-03-15T09:00:00Z')
    course.schedule[0].end = new Date('2022-03-15T16:00:00Z')
    course.id = await API.course.insertCourse(
      course,
      email,
      InviteStatus.ACCEPTED
    )
    await API.course.insertCourseParticipants(
      course.id,
      [users.user1WithOrg, users.user2WithOrg],
      new Date('2022-03-14T00:00:00Z')
    )
  }
})
