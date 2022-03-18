import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import useCourseModules from '@app/hooks/useCourseModules'
import { useFetcher } from '@app/hooks/use-fetcher'

import { ModulesSelection } from './index'

import { render, screen, within, userEvent, waitForText } from '@test/index'
import { LoadingStatus } from '@app/util'
import { buildCourseModule } from '@test/mock-data-utils'
import { MUTATION } from '@app/queries/courses/save-course-modules-selection'

jest.mock('@app/hooks/useCourseModules')
jest.mock('@app/hooks/use-fetcher')

const useCourseModulesMock = jest.mocked(useCourseModules)
const useFetcherMock = jest.mocked(useFetcher)

describe('page: ModulesSelection', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('displays a spinner while loading course modules', () => {
    const COURSE_ID = 'course-id'
    useCourseModulesMock.mockReturnValue({ status: LoadingStatus.FETCHING })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details/modules`]}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('modules-fetching')).toBeInTheDocument()
  })

  it('displays course modules within groups as selected by default', () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      buildCourseModule(),
      buildCourseModule(),
      buildCourseModule(),
    ]

    useCourseModulesMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details/modules`]}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </MemoryRouter>
    )

    courseModules.forEach(courseModule => {
      const moduleGroup = screen.getByTestId(
        `module-group-${courseModule.module.moduleGroup.id}`
      )

      expect(
        within(moduleGroup).getByLabelText(courseModule.module.name)
      ).toBeChecked()
    })

    expect(useCourseModulesMock).toHaveBeenCalledWith(COURSE_ID)
  })

  it('saves to local storage when selection is changed', () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      buildCourseModule(),
      buildCourseModule(),
      buildCourseModule(),
    ]

    useCourseModulesMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details/modules`]}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(screen.getByLabelText(courseModules[0].module.name))

    const storedSelection = localStorage.getItem(
      `modules-selection-${COURSE_ID}`
    )

    expect(JSON.parse(storedSelection ?? '')).toEqual({
      [courseModules[0].module.id]: false,
      [courseModules[1].module.id]: true,
      [courseModules[2].module.id]: true,
    })
  })

  it('displays course modules from local storage if already edited', () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      buildCourseModule(),
      buildCourseModule(),
      buildCourseModule(),
    ]

    useCourseModulesMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    localStorage.setItem(
      `modules-selection-${COURSE_ID}`,
      JSON.stringify({
        [courseModules[0].module.id]: false,
        [courseModules[1].module.id]: true,
        [courseModules[2].module.id]: true,
      })
    )

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details/modules`]}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByLabelText(courseModules[0].module.name)
    ).not.toBeChecked()
    expect(screen.getByLabelText(courseModules[1].module.name)).toBeChecked()
    expect(screen.getByLabelText(courseModules[2].module.name)).toBeChecked()
  })

  it('saves modules selection and redirects to the course manage page', async () => {
    const COURSE_ID = 'course-id'
    const fetcherMock = jest.fn()

    useFetcherMock.mockReturnValue(fetcherMock)
    fetcherMock.mockResolvedValue({
      saveCovered: { affectedRows: 2 },
      saveNotCovered: { affectedRows: 1 },
    })

    const courseModules = [
      buildCourseModule(),
      buildCourseModule(),
      buildCourseModule(),
    ]

    useCourseModulesMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details/modules`]}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
          <Route
            path="/trainer-base/course/:id/participants"
            element={<h1>Manage page</h1>}
          />
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(screen.getByLabelText(courseModules[0].module.name))
    userEvent.click(screen.getByText('Confirm grading details'))

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith(MUTATION, {
      courseId: COURSE_ID,
      coveredModules: [courseModules[1].module.id, courseModules[2].module.id],
      notCoveredModules: [courseModules[0].module.id],
    })

    await waitForText('Manage page')
  })

  it('navigates back to the module attendance page when clicked on the button', async () => {
    const COURSE_ID = 'course-id'

    useCourseModulesMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: [buildCourseModule(), buildCourseModule(), buildCourseModule()],
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details/modules`]}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
          <Route
            path="/trainer-base/course/:id/grading-details"
            element={<h1>Attendance page</h1>}
          />
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(screen.getByText('Back to attendees'))

    await waitForText('Attendance page')
  })
})
