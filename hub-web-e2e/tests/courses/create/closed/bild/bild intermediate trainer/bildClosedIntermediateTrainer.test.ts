import { test as base } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { closedCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { Accreditors_Enum } from '@qa/generated/graphql'
import { StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `closed BILD intermediate trainer F2F non-reaccred non-conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.conversion = false
        return course
      })(),
    },
    {
      name: `closed BILD intermediate trainer Mixed non-reaccred non-conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        course.conversion = false
        return course
      })(),
    },
    {
      name: `closed BILD intermediate trainer F2F reaccred non-conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.reaccreditation = true
        course.conversion = false
        return course
      })(),
    },
    {
      name: `closed BILD intermediate trainer Mixed reaccred non-conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        course.reaccreditation = true
        return course
      })(),
    },
    {
      name: `closed BILD intermediate trainer F2F non-reaccred conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.conversion = true
        return course
      })(),
    },
    {
      name: `closed BILD intermediate trainer Virtual non-reaccred conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Virtual
        course.conversion = true
        return course
      })(),
    },
    {
      name: `closed BILD intermediate trainer Mixed non-reaccred conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        course.conversion = true
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
          organization: { name: 'London First School' },
          bookingContactProfile: users.userOrgAdmin,
          level: Course_Level_Enum.BildIntermediateTrainer,
          accreditedBy: Accreditors_Enum.Bild,
          freeSpaces: 1,
          freeCourseMaterials: 10,
          salesRepresentative: users.salesAdmin,
        })
        await API.course.deleteCourse(data.course.id)
      },
    })

    // eslint-disable-next-line playwright/expect-expect
    test(`create course: ${data.name} ${data.smoke}`, async ({
      browser,
      course,
    }) => {
      await closedCourseSteps(browser, course, data.user as StoredCredentialKey)
    })
  }
})
