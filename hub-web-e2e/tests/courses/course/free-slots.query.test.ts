import { test as base } from '@playwright/test'
import { gql } from 'graphql-request'

import { RoleName } from '@app/types'

import {
  deleteCourse,
  insertCourse,
  insertCourseParticipants,
} from '@qa/api/hasura/course'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { users } from '@qa/data/users'
import { CourseFreeSlotsQuery } from '@qa/generated/graphql'

import { runQueryAsRole } from '../../gql-query'

const QUERY = gql`
  query CourseFreeSlots($id: Int!) {
    course_by_pk(id: $id) {
      freeSlots
    }
  }
`

const COURSE_INPUT = UNIQUE_COURSE()

const test = base.extend<{
  noParticipantsCourseId: number
  courseWithParticipantsId: number
}>({
  noParticipantsCourseId: async ({}, use) => {
    const id = await insertCourse(
      COURSE_INPUT,
      'trainer@teamteach.testinator.com'
    )

    await use(id)

    await deleteCourse(id)
  },
  courseWithParticipantsId: async ({}, use) => {
    const id = await insertCourse(
      COURSE_INPUT,
      'trainer@teamteach.testinator.com'
    )

    await insertCourseParticipants(id, [users.user1])

    await use(id)

    await deleteCourse(id)
  },
})

test("@query returns number of max participants if course doesn't have any participants", async ({
  noParticipantsCourseId,
}) => {
  const result = await runQueryAsRole<CourseFreeSlotsQuery>(
    QUERY,
    { id: noParticipantsCourseId },
    RoleName.TT_ADMIN
  )

  test
    .expect(result.course_by_pk?.freeSlots)
    .toEqual(COURSE_INPUT.max_participants)
})

test('@query returns correct number of free slots if there are participants on the course', async ({
  courseWithParticipantsId,
}) => {
  const result = await runQueryAsRole<CourseFreeSlotsQuery>(
    QUERY,
    { id: courseWithParticipantsId },
    RoleName.TT_ADMIN
  )

  test
    .expect(result.course_by_pk?.freeSlots)
    .toEqual(COURSE_INPUT.max_participants - 1)
})
