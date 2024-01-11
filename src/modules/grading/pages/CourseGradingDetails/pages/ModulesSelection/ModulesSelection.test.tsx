import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Accreditors_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourseModules from '@app/hooks/useCourseModules'
import { MUTATION } from '@app/queries/courses/save-course-modules-selection'
import { LoadingStatus } from '@app/util'

import {
  render,
  screen,
  within,
  userEvent,
  waitForText,
  waitFor,
} from '@test/index'
import { buildCourseModule } from '@test/mock-data-utils'

import { GradingDetailsProvider } from '../../components/GradingDetailsProvider'

import { ModulesSelection } from './ModulesSelection'

vi.mock('@app/hooks/useCourseModules')
vi.mock('@app/hooks/use-fetcher')

const useCourseModulesMock = vi.mocked(useCourseModules)
const useFetcherMock = vi.mocked(useFetcher)

describe('page: ModulesSelection', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('displays a spinner while loading course modules', () => {
    const COURSE_ID = 'course-id'
    useCourseModulesMock.mockReturnValue({ status: LoadingStatus.FETCHING })

    render(
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </GradingDetailsProvider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details/modules`] }
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
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </GradingDetailsProvider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details/modules`] }
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

  it('displays mandatory course modules within groups as selected by default and not clickable', () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      buildCourseModule(),
      buildCourseModule(),
      buildCourseModule(),
    ]

    courseModules[0].module.moduleGroup.mandatory = true

    useCourseModulesMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    render(
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </GradingDetailsProvider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details/modules`] }
    )

    const mandatoryModuleGroup = screen.getByTestId(
      `module-group-${courseModules[0].module.moduleGroup.id}`
    )

    expect(
      within(mandatoryModuleGroup).getByLabelText(courseModules[0].module.name)
    ).toBeChecked()

    expect(
      within(mandatoryModuleGroup).getByLabelText(courseModules[0].module.name)
    ).toBeDisabled()

    expect(useCourseModulesMock).toHaveBeenCalledWith(COURSE_ID)
  })

  it('saves to local storage when selection is changed', async () => {
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
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </GradingDetailsProvider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details/modules`] }
    )

    await userEvent.click(screen.getByLabelText(courseModules[0].module.name))

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
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
        </Routes>
      </GradingDetailsProvider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details/modules`] }
    )

    expect(
      screen.getByLabelText(courseModules[0].module.name)
    ).not.toBeChecked()
    expect(screen.getByLabelText(courseModules[1].module.name)).toBeChecked()
    expect(screen.getByLabelText(courseModules[2].module.name)).toBeChecked()
  })

  it('saves modules selection and redirects to the course manage page', async () => {
    const COURSE_ID = 'course-id'
    const fetcherMock = vi.fn()

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
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/:id/grading-details/modules"
            element={<ModulesSelection />}
          />
          <Route path="/courses/:id/details" element={<h1>Manage page</h1>} />
        </Routes>
      </GradingDetailsProvider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details/modules`] }
    )

    await userEvent.click(screen.getByLabelText(courseModules[0].module.name))
    await userEvent.click(screen.getByText('Continue to grading attendees'))

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith(MUTATION, {
      courseId: COURSE_ID,
      coveredModules: [courseModules[1].module.id, courseModules[2].module.id],
      notCoveredModules: [courseModules[0].module.id],
    })

    await waitForText('Manage page')
  })

  it('navigates back to the module grading clearance page when clicked on the button', async () => {
    useCourseModulesMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: [buildCourseModule(), buildCourseModule(), buildCourseModule()],
    })

    render(
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route path="/details">
            <Route index element={<h1>Grading clearance page</h1>} />
            <Route path="modules" element={<ModulesSelection />} />
          </Route>
        </Routes>
      </GradingDetailsProvider>,
      {},
      { initialEntries: ['/details', '/details/modules'] }
    )

    await userEvent.click(screen.getByText('Back to grading clearance'))

    await waitFor(() => {
      expect(screen.getByText(/grading clearance page/i)).toBeInTheDocument()
    })
  })
})
