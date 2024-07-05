import { expect, test as base } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import {
  Course_Type_Enum,
  UpsertPromoCodeMutation,
  UpsertPromoCodeMutationVariables,
} from '@app/generated/graphql'
import { UPSERT_PROMO_CODE } from '@app/queries/promo-codes/upsert-promo-code'
import { RoleName } from '@app/types'

import * as API from '@qa/api'
import { getProfileId } from '@qa/api/hasura/profile'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'

import { HasuraRole, runQueryAsRole } from '../gql-query'

// Based on the permissions found in
// hasura/metadata/databases/default/tables/public_course_promo_code.yaml
const allowedRoles: HasuraRole[] = [
  RoleName.FINANCE,
  RoleName.SALES_ADMIN,
  RoleName.TT_OPS,
]

const forbiddenRoles: HasuraRole[] = [
  RoleName.ANONYMOUS,
  RoleName.LD,
  RoleName.SALES_REPRESENTATIVE,
  RoleName.UNVERIFIED,
]

function buildPromoCode(
  courseId: number,
  createdBy: string,
): UpsertPromoCodeMutationVariables {
  const uniquePart =
    new Date().getTime() + Math.random().toString(36).slice(2, 7)
  return {
    promoCondition: { id: { _is_null: true } },
    promoCode: {
      courses: { data: [{ course_id: courseId }] },
      amount: 100,
      createdBy,
      code: `PROMO_100_TESTS_${uniquePart}`,
    },
  }
}

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = Course_Type_Enum.Open
    course.id = (await API.course.insertCourse(course, users.trainer.email)).id
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
      },
    )
    expect(results?.insert_promo_code_one?.id).not.toBeNull()
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
        },
      ),
    ).rejects.toEqual(expect.any(Error))
  })
})
