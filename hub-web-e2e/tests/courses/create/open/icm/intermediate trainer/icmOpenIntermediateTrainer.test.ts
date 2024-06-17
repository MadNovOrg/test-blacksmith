import { test as base } from '@playwright/test'

import { Course_Level_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { openCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `open intermediate trainer f2f reaccredidation as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        return course
      })(),
    },
    {
      name: `open intermediate trainer f2f non-reaccredidation as ${allowedUser}`,
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
        await use({
          ...data.course,
          level: Course_Level_Enum.IntermediateTrainer,
        })
        await API.course.deleteCourse(data.course.id)
      },
    })

    //eslint-disable-next-line playwright/expect-expect
    test(`create course: ${data.name} ${data.smoke}`, async ({
      browser,
      course,
    }) => {
      await openCourseSteps(browser, course, data.user as StoredCredentialKey)
    })
  }
})
