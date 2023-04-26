import { expect, test as base } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import {
  InsertPromoCodeMutation,
  InsertPromoCodeMutationVariables,
} from '@app/generated/graphql'
import INSERT_PROMO_CODE from '@app/queries/promo-codes/insert-promo-code'
import { CourseType } from '@app/types'

import * as API from '../../../api'
import { getProfileId } from '../../../api/hasura/profile'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { HasuraRole, runQueryAsRole } from '../gql-query'

const allowedRoles: HasuraRole[] = ['sales-admin', 'tt-ops']

const forbiddenRoles: HasuraRole[] = ['anonymous', 'unverified']

function buildPromoCode(
  courseId: number,
  createdBy: string
): InsertPromoCodeMutationVariables {
  return {
    promoCode: {
      courses: { data: [{ course_id: courseId }] },
      amount: 100,
      createdBy,
      code: 'PROMO_100_TESTS',
    },
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
  test(`@query InsertPromoCode: role ${role} should be able to run the mutation`, async ({
    course,
  }) => {
    const adminId = await getProfileId(users.admin.email)

    const results = await runQueryAsRole<InsertPromoCodeMutation>(
      INSERT_PROMO_CODE,
      buildPromoCode(course.id, adminId),
      role,
      {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      }
    )
    await expect(results.insert_promo_code_one?.id).not.toBeNull()
    API.promoCode.remove(results.insert_promo_code_one?.id)
  })
})

forbiddenRoles.forEach(role => {
  test(`@query InsertPromoCode: role ${role} should not be able to run the mutation`, async ({
    course,
  }) => {
    const adminId = await getProfileId(users.admin.email)

    await expect(
      runQueryAsRole(
        INSERT_PROMO_CODE,
        buildPromoCode(course.id, adminId),
        role,
        {
          'x-hasura-user-id': uuidv4(),
          'x-hasura-user-email': 'whatever',
        }
      )
    ).rejects.toEqual(expect.any(Error))
  })
})
