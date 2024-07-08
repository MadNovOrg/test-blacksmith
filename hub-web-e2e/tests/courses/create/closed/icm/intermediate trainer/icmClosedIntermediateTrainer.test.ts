/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { closedCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { StoredCredentialKey } from '@qa/util'

const allowdUsers = ['admin', 'ops', 'salesAdmin']

allowdUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `closed Intermediate Trainer F2F reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        return course
      })(),
    },
    {
      name: `closed Intermediate Trainer F2F non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
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
          level: Course_Level_Enum.IntermediateTrainer,
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

    // eslint-disable-next-line playwright/expect-expect, playwright/no-focused-test
    test(`create course: ${data.name} ${data.smoke}`, async ({
      browser,
      course,
    }) => {
      await closedCourseSteps(browser, course, data.user as StoredCredentialKey)
    })
  }
})
