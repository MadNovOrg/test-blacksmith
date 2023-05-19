import { expect, test as base } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import {
  Course_Invite_Status_Enum,
  SaveCourseInvitesMutation,
  SaveCourseInvitesMutationVariables,
} from '@app/generated/graphql'
import { MUTATION as SaveInvites } from '@app/queries/invites/save-course-invites'
import { CourseType, RoleName } from '@app/types'

import * as API from '@qa/api'
import { getProfileId } from '@qa/api/hasura/profile'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'

import { buildInvite } from '@test/mock-data-utils'

import { HasuraRole, runQueryAsRole } from '../gql-query'

const allowedRoles: HasuraRole[] = [
  RoleName.TRAINER,
  RoleName.SALES_ADMIN,
  RoleName.TT_OPS,
  RoleName.TT_ADMIN,
]

const forbiddenRoles: HasuraRole[] = [RoleName.ANONYMOUS, RoleName.UNVERIFIED]

function buildMutationInput(
  courseId: number
): SaveCourseInvitesMutationVariables {
  const invite = buildInvite()
  return {
    invites: [
      {
        course_id: courseId,
        email: invite.email,
        status: invite.status as unknown as Course_Invite_Status_Enum,
      },
    ],
  }
}

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.OPEN
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

allowedRoles.forEach(role => {
  test(`@query SaveCourseInvitation: role ${role} should be able to run the mutation`, async ({
    course,
  }) => {
    const trainerId = await getProfileId(users.trainer.email)

    const results = await runQueryAsRole<SaveCourseInvitesMutation>(
      SaveInvites,
      buildMutationInput(course.id),
      role,
      {
        'x-hasura-user-id': role === RoleName.TRAINER ? trainerId : uuidv4(),
        'x-hasura-user-email': 'whatever',
      }
    )
    await expect(results.insert_course_invites?.returning[0].id).not.toBeNull()
  })
})

forbiddenRoles.forEach(role => {
  test(`@query SaveCourseInvitation: role ${role} should not be able to run the mutation`, async ({
    course,
  }) => {
    await expect(
      runQueryAsRole(SaveInvites, buildMutationInput(course.id), role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      })
    ).rejects.toEqual(expect.any(Error))

    API.course.deleteCourse(course.id)
  })
})
