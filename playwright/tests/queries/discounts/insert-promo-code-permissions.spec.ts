import { expect, test as base } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import {
  UpsertPromoCodeMutation,
  UpsertPromoCodeMutationVariables,
} from '@app/generated/graphql'
import UPSERT_PROMO_CODE from '@app/queries/promo-codes/upsert-promo-code'
import { CourseType } from '@app/types'

import * as API from '../../../api'
import { getProfileId } from '../../../api/hasura/profile'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { HasuraRole, runQueryAsRole } from '../gql-query'

// Based on the permissions found in
// hasura/metadata/databases/default/tables/public_course_promo_code.yaml
const allowedRoles: HasuraRole[] = ['finance', 'sales-admin', 'tt-ops']

const forbiddenRoles: HasuraRole[] = [
  'anonymous',
  'ld',
  'sales-representative',
  'unverified',
]

function buildPromoCode(
  courseId: number,
  createdBy: string
): UpsertPromoCodeMutationVariables {
  return {
    promoCondition: { id: { _is_null: true } },
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
  test(`@query UpsertPromoCode: role ${role} should be able to run the mutation`, async ({
    course,
  }) => {
    const adminId = await getProfileId(users.admin.email)

    const results = await runQueryAsRole<UpsertPromoCodeMutation>(
      UPSERT_PROMO_CODE,
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
        UPSERT_PROMO_CODE,
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
