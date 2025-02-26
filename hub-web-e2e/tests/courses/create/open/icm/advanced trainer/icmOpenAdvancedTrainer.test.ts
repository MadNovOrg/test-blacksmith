import { test as base } from '@playwright/test'

import { Course_Level_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { openCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { StoredCredentialKey, stateFilePath } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

let courseIDToDelete: number
allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `open advanced trainer f2f reaccredidation as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        return course
      })(),
    },
    {
      name: `open advanced trainer f2f non-reaccredidation as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        return course
      })(),
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{ course: Course }>({
      course: async ({}, use) => {
        await use({ ...data.course, level: Course_Level_Enum.AdvancedTrainer })
        await API.course.deleteCourse(data.course.id)
      },
    })

    test.use({
      storageState: stateFilePath(data.user as StoredCredentialKey),
    })

    test.afterEach(async () => {
      await API.course.deleteCourse(courseIDToDelete)
    })

    test.describe('Skip this test on anz as the level does not exist', () => {
      if (!isUK()) {
        test.skip()
      } else {
        //eslint-disable-next-line playwright/expect-expect
        test(`create course: ${data.name} ${data.smoke}`, async ({
          browser,
          course,
        }) => {
          courseIDToDelete = await openCourseSteps(
            browser,
            course,
            data.user as StoredCredentialKey,
          )
        })
      }
    })
  }
})
