import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { VenueSelector } from '@app/components/VenueSelector'
import { Accreditors_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import { BildStrategies, CourseLevel, CourseType, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { EditCourse } from '.'

jest.mock('@app/hooks/useCourse')
jest.mock('@app/components/VenueSelector', () => ({
  VenueSelector: jest.fn(),
}))
jest.mock('@app/hooks/use-fetcher')
const useFetcherMock = jest.mocked(useFetcher)

const useCourseMocked = jest.mocked(useCourse)
const VenueSelectorMocked = jest.mocked(VenueSelector)

describe('page: EditCourse', () => {
  beforeAll(() => {
    const fetcherMock = jest.fn()
    useFetcherMock.mockReturnValue(fetcherMock)
    fetcherMock.mockResolvedValue({ members: [] })
    VenueSelectorMocked.mockImplementation(() => <p>test</p>)
  })

  it('displays spinner while loading for the course', () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
      data: undefined,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByTestId('edit-course-fetching')).toBeInTheDocument()
  })

  it('displays a message if there is no course', () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: undefined,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.queryByTestId('edit-course-fetching')).not.toBeInTheDocument()
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("displays an error message if can't load the course to edit", () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.ERROR,
      data: undefined,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.queryByTestId('edit-course-fetching')).not.toBeInTheDocument()
    expect(
      screen.getByText('There was an error loading the course')
    ).toBeInTheDocument()
  })

  it("doesn't allow trainer to edit open course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.OPEN,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TRAINER } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to edit open course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.OPEN,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.USER } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow trainer to edit closed course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TRAINER } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to edit closed course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.USER } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow Sales admin role to edit indirect course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.INDIRECT,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.SALES_ADMIN } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to edit indirect course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.INDIRECT,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.USER } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('pre-selects and disables BILD strategy toggles when editing', async () => {
    const openCourse = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Bild,
        type: CourseType.CLOSED,
        bildStrategies: [
          { strategyName: BildStrategies.Primary },
          { strategyName: BildStrategies.Secondary },
        ],
        level: CourseLevel.BildRegular,
      },
    })

    useCourseMocked.mockReturnValue({
      data: openCourse,
      status: LoadingStatus.IDLE,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    await waitFor(() => {
      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourse />} />
          </Routes>
        </Provider>,
        { auth: { activeRole: RoleName.TT_ADMIN } },
        { initialEntries: ['/courses/edit/1'] }
      )
    })

    const primaryToggle = screen.getByLabelText(/primary/i)
    const secondaryToggle = screen.getByLabelText(/secondary/i)
    const nonRestrictiveToggle = screen.getByLabelText(
      /non restrictive tertiary/i
    )
    const intermediateToggle = screen.getByLabelText(
      /restrictive tertiary intermediate/i
    )
    const advancedToggle = screen.getByLabelText(
      /restrictive tertiary advanced/i
    )

    const selectedToggles = [primaryToggle, secondaryToggle]
    const notSelectedToggles = [
      nonRestrictiveToggle,
      intermediateToggle,
      advancedToggle,
    ]

    selectedToggles.forEach(toggle => {
      expect(toggle).toBeChecked()
      expect(toggle).toBeDisabled()
    })

    notSelectedToggles.forEach(toggle => {
      expect(toggle).not.toBeChecked()
      expect(toggle).toBeDisabled()
    })
  })

  it('pre-selects and disables blended learning, reaccreditation toggles on ICM course', async () => {
    const closedCourse = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        type: CourseType.CLOSED,
        level: CourseLevel.Level_1,
        go1Integration: true,
        reaccreditation: false,
      },
    })

    useCourseMocked.mockReturnValue({
      data: closedCourse,
      status: LoadingStatus.IDLE,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    await waitFor(() => {
      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourse />} />
          </Routes>
        </Provider>,
        { auth: { activeRole: RoleName.TT_ADMIN } },
        { initialEntries: ['/courses/edit/1'] }
      )
    })

    const blendedLearningToggle = screen.getByLabelText(/blended learning/i)
    const reaccreditationToggle = screen.getByLabelText(/reaccreditation/i)

    expect(blendedLearningToggle).toBeDisabled()
    expect(blendedLearningToggle).toBeChecked()

    expect(reaccreditationToggle).toBeDisabled()
    expect(reaccreditationToggle).not.toBeChecked()
  })

  it('pre-selects and disables blended learning, reaccreditation toggles on BILD course', async () => {
    const openCourse = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Bild,
        type: CourseType.OPEN,
        level: CourseLevel.BildIntermediateTrainer,
        go1Integration: false,
        reaccreditation: false,
        conversion: true,
      },
    })

    useCourseMocked.mockReturnValue({
      data: openCourse,
      status: LoadingStatus.IDLE,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    await waitFor(() => {
      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourse />} />
          </Routes>
        </Provider>,
        { auth: { activeRole: RoleName.TT_ADMIN } },
        { initialEntries: ['/courses/edit/1'] }
      )
    })

    const blendedLearningToggle = screen.getByLabelText(/blended learning/i)
    const reaccreditationToggle = screen.getByLabelText(/reaccreditation/i)
    const conversionToggle = screen.getByLabelText(/conversion course/i)

    expect(blendedLearningToggle).toBeDisabled()
    expect(blendedLearningToggle).not.toBeChecked()

    expect(conversionToggle).toBeDisabled()
    expect(conversionToggle).toBeChecked()

    expect(reaccreditationToggle).toBeDisabled()
    expect(reaccreditationToggle).not.toBeChecked()
  })
})
