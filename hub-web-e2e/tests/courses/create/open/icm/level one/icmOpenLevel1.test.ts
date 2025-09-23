import { test as base } from '@playwright/test'

import { Course_Delivery_Type_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { openCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

let courseIDToDelete: number
allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `open L1 virtual as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Virtual
        return course
      })(),
    },
    {
      name: `open L1 F2F as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        return course
      })(),
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{ course: Course }>({
      course: async ({}, use) => {
        await use(data.course)
        await API.course.deleteCourse(data.course.id)
      },
    })

    test.afterEach(async () => {
      await API.course.deleteCourse(courseIDToDelete)
    })

    // eslint-disable-next-line playwright/expect-expect
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
