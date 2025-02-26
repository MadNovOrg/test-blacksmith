/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { closedCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { StoredCredentialKey } from '@qa/util'

const allowdUsers = ['admin', 'ops', 'salesAdmin']

let courseIDToDelete: number
allowdUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `closed Advanced Modules F2F non-reaccred non blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.go1Integration = false
        return course
      })(),
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{ course: Course }>({
      course: async ({}, use) => {
        await use({
          ...data.course,
          type: Course_Type_Enum.Closed,
          level: Course_Level_Enum.Advanced,
          organization: { name: 'London First School' },
          bookingContactProfile: users.userOrgAdmin,
          freeSpaces: 1,
          max_participants: 13,
          freeCourseMaterials: 8,
          salesRepresentative: users.salesAdmin,
        })
        await API.course.deleteCourse(data.course.id)
      },
    })

    test.afterEach(async () => {
      await API.course.deleteCourse(courseIDToDelete)
    })
    test.describe('Skip this test on ANZ because we do not have Advanced Modules level there', () => {
      if (!isUK()) {
        // skip on anz
        test.skip()
      } else {
        // eslint-disable-next-line playwright/expect-expect, playwright/no-focused-test
        test(`create course: ${data.name} ${data.smoke}`, async ({
          browser,
          course,
        }) => {
          courseIDToDelete = await closedCourseSteps(
            browser,
            course,
            data.user as StoredCredentialKey,
          )
        })
      }
    })
  }
})
