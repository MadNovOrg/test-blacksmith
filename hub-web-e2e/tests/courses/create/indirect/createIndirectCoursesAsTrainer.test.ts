/* eslint-disable playwright/no-conditional-in-test */
import { test as base, expect } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { MODULES_SETUP_UK, MODULES_SETUP_ANZ } from '@qa/data/modules'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { CourseBuilderPage } from '@qa/fixtures/pages/courses/CourseBuilderPage.fixture'
import { CourseOrderDetailsPage } from '@qa/fixtures/pages/courses/CourseOrderDetailsPage.fixture'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { ReviewAndConfirmPage } from '@qa/fixtures/pages/courses/ReviewAndConfirmPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

let courseIDToDelete: number
const MODULES_SETUP = isUK() ? MODULES_SETUP_UK : MODULES_SETUP_ANZ
const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const orgName = 'London First School'

    const course = UNIQUE_COURSE()

    course.freeSpaces = 1
    course.organization = { name: orgName }
    course.organizationKeyContactProfile = users.userOrgAdmin
    course.salesRepresentative = users.salesAdmin
    course.type = Course_Type_Enum.Indirect

    await use({ ...course, go1Integration: false })
  },
})

test.afterEach(async () => {
  await API.course.deleteCourse(courseIDToDelete)
})
const indirectLevels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]

indirectLevels.forEach(level => {
  test(`create indirect course --- ${level} blended learning as 'trainer' --- @smoke`, async ({
    browser,
    course,
  }) => {
    const context = await browser.newContext({
      storageState: stateFilePath('trainer' as StoredCredentialKey),
    })
    const page = await context.newPage()
    const coursesListPage = new MyCoursesPage(page)
    await coursesListPage.goto()
    const createCoursePage =
      await coursesListPage.createCourseMenu.clickCreateCourseButton()
    await createCoursePage.fillCourseDetails({
      ...course,
      go1Integration: true,
      level,
    })
    await createCoursePage.clickOrderDetailsButton()
    const orderDetailsPage = new CourseOrderDetailsPage(page)
    await orderDetailsPage.fillInvoiceDetails(course.invoiceDetails)
    await orderDetailsPage.clickReviewAndConfirmButton()
    const reviewAndConfirmPage = new ReviewAndConfirmPage(page)
    const courseBuilder =
      await reviewAndConfirmPage.getCourseIdAfterProceedingToCourseBuilder()
    const courseBuilderPage = courseBuilder.courseBuilderPage
    if (level === Course_Level_Enum.Level_2) {
      await courseBuilderPage.selectModule(
        MODULES_SETUP.filter(
          setup => setup.name === 'level 2 f2f',
        )[0].optionalModules.map(module => module.name),
      )
    }
    const { newCourse } = await courseBuilderPage.clickSubmitButton()
    course.id = newCourse?.id as number
    courseIDToDelete = course.id
    coursesListPage.waitForPageLoad()
    expect(page.url()).toContain(course.id.toString())
    console.log(
      `Created indirect ${level} blended learning course as trainer with id ${course.id}`,
    )
  })

  test(`create indirect course --- ${level} as trainer @smoke`, async ({
    browser,
    course,
  }) => {
    const context = await browser.newContext({
      storageState: stateFilePath('trainer' as StoredCredentialKey),
    })
    const page = await context.newPage()
    const coursesListPage = new MyCoursesPage(page)

    await coursesListPage.goto()
    const createCoursePage =
      await coursesListPage.createCourseMenu.clickCreateCourseButton()
    await createCoursePage.fillCourseDetails({
      ...course,
      level,
      deliveryType: Course_Delivery_Type_Enum.F2F,
    })

    await createCoursePage.clickCreateCourseButton()
    const courseBuilderPage = new CourseBuilderPage(page)
    if (level === Course_Level_Enum.Level_2) {
      await courseBuilderPage.selectModule(
        MODULES_SETUP.filter(
          setup => setup.name === 'level 2 f2f',
        )[0].optionalModules.map(module => module.name),
      )
    }
    const { newCourse } = await courseBuilderPage.clickSubmitButton()
    course.id = newCourse?.id as number
    await coursesListPage.waitForPageLoad()
    expect(page.url()).toContain(course.id.toString())
  })

  test(`create indirect course --- ${level} reaccreditation as trainer @smoke`, async ({
    browser,
    course,
  }) => {
    const context = await browser.newContext({
      storageState: stateFilePath('trainer' as StoredCredentialKey),
    })
    const page = await context.newPage()
    const coursesListPage = new MyCoursesPage(page)
    await coursesListPage.goto()
    const createCoursePage =
      await coursesListPage.createCourseMenu.clickCreateCourseButton()

    await createCoursePage.fillCourseDetails({
      ...course,
      level,
      deliveryType: Course_Delivery_Type_Enum.F2F,
      reaccreditation: true,
    })
    await createCoursePage.clickCreateCourseButton()

    const courseBuilderPage = new CourseBuilderPage(page)
    if (level === Course_Level_Enum.Level_2) {
      await courseBuilderPage.selectModule(
        MODULES_SETUP.filter(
          setup => setup.name === 'level 2 f2f reaccred',
        )[0].optionalModules.map(module => module.name),
      )
    }
    const { newCourse } = await courseBuilderPage.clickSubmitButton()
    course.id = newCourse?.id as number
    course.course_code = newCourse?.course_code as string

    expect(page.url()).toContain(course.id.toString())
  })
})

test.describe('Skip this test on anz as the level does not exist on ANZ', () => {
  if (!isUK()) {
    test.skip()
  } else {
    test(`create indirect course --- ${Course_Level_Enum.Advanced} as trainer @smoke`, async ({
      browser,
      course,
    }) => {
      const context = await browser.newContext({
        storageState: stateFilePath('trainer'),
      })
      const page = await context.newPage()
      const coursesListPage = new MyCoursesPage(page)
      await coursesListPage.goto()
      const createCoursePage =
        await coursesListPage.createCourseMenu.clickCreateCourseButton()

      await createCoursePage.fillCourseDetails({
        ...course,
        level: Course_Level_Enum.Advanced,
      })
      await createCoursePage.clickCreateCourseButton()

      const courseBuilderPage = new CourseBuilderPage(page)
      const { newCourse } = await courseBuilderPage.clickSubmitButton()
      course.id = newCourse?.id as number
      expect(page.url()).toContain(course.id.toString())
    })
  }
})
