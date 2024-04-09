import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { TEST_SETTINGS } from '@qa/constants'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Audit_Type } from '@qa/data/enums'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { AuditPage } from '@qa/fixtures/pages/administration/AuditPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ course: Course; role: string }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.Scheduled
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.beforeEach(async ({}) => {
  TEST_SETTINGS.role = 'tt-admin'
})

test.afterEach(async ({}) => {
  TEST_SETTINGS.role = undefined
})

test.use({ storageState: stateFilePath('admin') })

test('displays the audit trail for a cancelled course', async ({
  course,
  page,
}) => {
  await API.course.cancelCourse(course.id)
  const auditPage = new AuditPage(page)
  await auditPage.goto(Audit_Type.CourseCancellation)
  await auditPage.checkCourseCancelled(course.id)
})
