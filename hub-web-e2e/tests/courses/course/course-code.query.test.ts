/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'
import { gql } from 'graphql-request'

import { BildStrategy } from '@app/generated/graphql'

import { getClient } from '@qa/api/hasura/client'
import { deleteCourse } from '@qa/api/hasura/course'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Insert_Input,
  Course_Level_Enum,
  Course_Type_Enum,
  InsertCourseForCodesMutation,
  InsertCourseForCodesMutationVariables,
} from '@qa/generated/graphql'

const MUTATION = gql`
  mutation InsertCourseForCodes($input: course_insert_input!) {
    insert_course_one(object: $input) {
      id
      course_code
    }
  }
`

async function insertCourse(input: Course_Insert_Input) {
  const client = getClient()

  return client.request<
    InsertCourseForCodesMutation,
    InsertCourseForCodesMutationVariables
  >(MUTATION, { input })
}

const test = base.extend<{
  bildCourses: {
    bildRegular: InsertCourseForCodesMutation['insert_course_one']
    bildIntermediate: InsertCourseForCodesMutation['insert_course_one']
    bildAdvanced: InsertCourseForCodesMutation['insert_course_one']
  }
  icmCourses: {
    level1: InsertCourseForCodesMutation['insert_course_one']
    level2: InsertCourseForCodesMutation['insert_course_one']
    advanced: InsertCourseForCodesMutation['insert_course_one']
    intermediateTrainer: InsertCourseForCodesMutation['insert_course_one']
    advancedTrainer: InsertCourseForCodesMutation['insert_course_one']
  }
}>({
  bildCourses: async ({}, use) => {
    base.setTimeout(600000)
    const [bildRegular, bildIntermediate, bildAdvanced] = await Promise.all([
      insertCourse(
        buildCourseInput({
          accreditedBy: Accreditors_Enum.Bild,
          type: Course_Type_Enum.Indirect,
          level: Course_Level_Enum.BildRegular,
          go1Integration: true,
          deliveryType: Course_Delivery_Type_Enum.Virtual,
          bildStrategies: {
            data: [
              { strategyName: BildStrategy.Primary },
              { strategyName: BildStrategy.Secondary },
              { strategyName: BildStrategy.NonRestrictiveTertiary },
              { strategyName: BildStrategy.RestrictiveTertiaryIntermediate },
              { strategyName: BildStrategy.RestrictiveTertiaryAdvanced },
            ],
          },
        })
      ),
      insertCourse(
        buildCourseInput({
          accreditedBy: Accreditors_Enum.Bild,
          type: Course_Type_Enum.Open,
          level: Course_Level_Enum.BildIntermediateTrainer,
          deliveryType: Course_Delivery_Type_Enum.Mixed,
          conversion: true,
        })
      ),
      insertCourse(
        buildCourseInput({
          accreditedBy: Accreditors_Enum.Bild,
          type: Course_Type_Enum.Closed,
          level: Course_Level_Enum.BildAdvancedTrainer,
          deliveryType: Course_Delivery_Type_Enum.F2F,
        })
      ),
    ])

    await use({
      bildRegular: bildRegular.insert_course_one,
      bildIntermediate: bildIntermediate.insert_course_one,
      bildAdvanced: bildAdvanced.insert_course_one,
    })

    await Promise.all([
      deleteCourse(bildRegular.insert_course_one?.id),
      deleteCourse(bildIntermediate.insert_course_one?.id),
      deleteCourse(bildAdvanced.insert_course_one?.id),
    ])
  },
  icmCourses: async ({}, use) => {
    base.setTimeout(600000)
    const [level1, level2, advanced, intermediateTrainer, advancedTrainer] =
      await Promise.all([
        insertCourse(
          buildCourseInput({
            level: Course_Level_Enum.Level_1,
            reaccreditation: true,
          })
        ),
        insertCourse(
          buildCourseInput({
            level: Course_Level_Enum.Level_2,
          })
        ),
        insertCourse(
          buildCourseInput({
            level: Course_Level_Enum.Advanced,
          })
        ),
        insertCourse(
          buildCourseInput({
            level: Course_Level_Enum.IntermediateTrainer,
          })
        ),
        insertCourse(
          buildCourseInput({
            level: Course_Level_Enum.AdvancedTrainer,
          })
        ),
      ])

    await use({
      level1: level1.insert_course_one,
      level2: level2.insert_course_one,
      advanced: advanced.insert_course_one,
      intermediateTrainer: intermediateTrainer.insert_course_one,
      advancedTrainer: advancedTrainer.insert_course_one,
    })

    await Promise.all([
      deleteCourse(level1.insert_course_one?.id),
      deleteCourse(level2.insert_course_one?.id),
      deleteCourse(advanced.insert_course_one?.id),
      deleteCourse(intermediateTrainer.insert_course_one?.id),
      deleteCourse(advancedTrainer.insert_course_one?.id),
    ])
  },
})

test('returns correct course codes for BILD courses', async ({
  bildCourses,
}) => {
  const { bildRegular, bildIntermediate, bildAdvanced } = bildCourses

  test
    .expect(bildRegular?.course_code)
    .toEqual(`BL.B.V.INDR.PSTIA-${bildRegular?.id}`)

  test
    .expect(bildIntermediate?.course_code)
    .toEqual(`B.INT.C.VF.OP-${bildIntermediate?.id}`)

  test
    .expect(bildAdvanced?.course_code)
    .toEqual(`B.ADV.F.CL-${bildAdvanced?.id}`)
})

test('returns correct course codes for ICM courses', async ({ icmCourses }) => {
  const { level1, level2, advanced, intermediateTrainer, advancedTrainer } =
    icmCourses

  test.expect(level1?.course_code).toEqual(`L1.RE.F.OP-${level1?.id}`)
  test.expect(level2?.course_code).toEqual(`L2.F.OP-${level2?.id}`)
  test.expect(advanced?.course_code).toEqual(`ADVMOD.F.OP-${advanced?.id}`)
  test
    .expect(intermediateTrainer?.course_code)
    .toEqual(`INT.F.OP-${intermediateTrainer?.id}`)
  test
    .expect(advancedTrainer?.course_code)
    .toEqual(`ADV.F.OP-${advancedTrainer?.id}`)
})

function buildCourseInput(
  overrides: Partial<Course_Insert_Input>
): Course_Insert_Input {
  return {
    name: 'Course name',
    deliveryType: Course_Delivery_Type_Enum.F2F,
    type: Course_Type_Enum.Open,
    ...overrides,
  }
}
