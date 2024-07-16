import { test as base, expect } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { MODULES_SETUP } from '@qa/data/modules'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { CourseBuilderPage } from '@qa/fixtures/pages/courses/CourseBuilderPage.fixture'
import { CourseOrderDetailsPage } from '@qa/fixtures/pages/courses/CourseOrderDetailsPage.fixture'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { ReviewAndConfirmPage } from '@qa/fixtures/pages/courses/ReviewAndConfirmPage.fixture'
import { stateFilePath } from '@qa/util'

let courseIDToDelete: number
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

test.use({
  storageState: stateFilePath('trainer'),
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
    const context = await browser.newContext()
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
    await courseBuilderPage.clickSubmitButton()
    course.id = courseBuilder.id
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
    const context = await browser.newContext()
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

    const createCourse = await createCoursePage.clickCreateCourseButton()
    const courseBuilderPage = new CourseBuilderPage(page)
    if (level === Course_Level_Enum.Level_2) {
      await courseBuilderPage.selectModule(
        MODULES_SETUP.filter(
          setup => setup.name === 'level 2 f2f',
        )[0].optionalModules.map(module => module.name),
      )
    }
    await courseBuilderPage.clickSubmitButton()
    course.id = createCourse.id
    await coursesListPage.waitForPageLoad()
    expect(page.url()).toContain(course.id.toString())
  })

  test(`create indirect course --- ${level} reaccreditation as trainer @smoke`, async ({
    browser,
    course,
  }) => {
    const context = await browser.newContext()
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
    const createCourse = await createCoursePage.clickCreateCourseButton()
    course.id = createCourse.id
    course.course_code = createCourse.courseCode
    const courseBuilderPage = new CourseBuilderPage(page)
    if (level === Course_Level_Enum.Level_2) {
      await courseBuilderPage.selectModule(
        MODULES_SETUP.filter(
          setup => setup.name === 'level 2 f2f reaccred',
        )[0].optionalModules.map(module => module.name),
      )
    }
    await courseBuilderPage.clickSubmitButton()
    expect(page.url()).toContain(course.id.toString())
  })
})

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
  const createCourse = await createCoursePage.clickCreateCourseButton()
  course.id = createCourse.id
  const courseBuilderPage = new CourseBuilderPage(page)
  await courseBuilderPage.clickSubmitButton()
  expect(page.url()).toContain(course.id.toString())
})
