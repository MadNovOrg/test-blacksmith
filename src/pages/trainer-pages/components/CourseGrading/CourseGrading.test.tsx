import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Grade_Enum } from '@app/generated/graphql'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'
import { noop } from '@app/util'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { CourseGrading } from './CourseGrading'

jest.mock('@app/hooks/useCourseParticipants')
const useCourseParticipantsMocked = jest.mocked(useCourseParticipants)

describe('component: CourseGrading', () => {
  it('displays spinner while loading for participants', () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
      mutate: jest.fn(),
    })

    render(<CourseGrading course={course} refreshCourse={noop} />)

    expect(screen.getByTestId('course-fetching')).toBeInTheDocument()
  })

  it('displays grading table with all participants', () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    const participants = [
      { ...buildParticipant(), attended: false, grade: Grade_Enum.Fail },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(<CourseGrading course={course} refreshCourse={noop} />)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(4)
    expect(within(columnHeaders[0]).getByText('Name')).toBeInTheDocument()
    expect(within(columnHeaders[1]).getByText('Email')).toBeInTheDocument()
    expect(
      within(columnHeaders[2]).getByText('Organisation')
    ).toBeInTheDocument()
    expect(within(columnHeaders[3]).getByText('Grade')).toBeInTheDocument()

    const gradeCells = screen.getAllByTestId(`grade-cell`)

    expect(
      screen.getByText(participants[0].profile.fullName)
    ).toBeInTheDocument()
    expect(gradeCells[0]).toHaveTextContent('Fail View')
    expect(
      screen.getByText(participants[1].profile.fullName)
    ).toBeInTheDocument()
    expect(gradeCells[1]).toHaveTextContent('Grade')
    expect(
      screen.getByText(participants[2].profile.fullName)
    ).toBeInTheDocument()
    expect(gradeCells[2]).toHaveTextContent('Grade')
  })

  it('shows button to modify grading details', async () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    const participants = [
      { ...buildParticipant(), attended: false, grade: Grade_Enum.Fail },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(
      <Routes>
        <Route
          path="/courses/:id/details"
          element={<CourseGrading course={course} refreshCourse={noop} />}
        />
        <Route
          path="/courses/:id/grading-details"
          element={<h1>Grading clearance</h1>}
        />
      </Routes>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/${course.id}/details`] }
    )
    const button = screen.getByRole('button', {
      name: 'Modify grading details',
    })
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    await waitFor(() =>
      expect(screen.getByText('Grading clearance')).toBeInTheDocument()
    )
  })

  it('disables button to modify grading details if grading has started', async () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    course.gradingStarted = true
    const participants = [
      { ...buildParticipant(), attended: false, grade: Grade_Enum.Fail },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(<CourseGrading course={course} refreshCourse={noop} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })
    const button = screen.getByRole('button', {
      name: 'Modify grading details',
    })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it("doesn't display grading button if a user doesn't have a permission to grade participants", () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    course.gradingStarted = true
    const participants = [
      { ...buildParticipant(), attended: false, grade: Grade_Enum.Fail },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(<CourseGrading course={course} refreshCourse={noop} />, {
      auth: { activeRole: RoleName.SALES_ADMIN },
    })

    expect(screen.queryByText(/grade selected/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/grade all attendees/i)).not.toBeInTheDocument()
  })

  it("disables individual grade button if a user doesn't have a permission to grade participants", () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    course.gradingStarted = true
    const participants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(<CourseGrading course={course} refreshCourse={noop} />, {
      auth: { activeRole: RoleName.SALES_ADMIN },
    })

    participants.forEach(participant => {
      const row = screen.getByTestId(
        `attending-participant-row-${participant.id}`
      )

      expect(within(row).getByText(/grade/i)).toHaveAttribute(
        'aria-disabled',
        'true'
      )
    })
  })

  it("hides modify grade details button if a user doesn't have permission to grade participants", () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    course.gradingStarted = true
    const participants = [
      { ...buildParticipant(), attended: false, grade: Grade_Enum.Fail },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(<CourseGrading course={course} refreshCourse={noop} />, {
      auth: { activeRole: RoleName.SALES_ADMIN },
    })

    expect(
      screen.queryByRole('button', {
        name: 'Modify grading details',
      })
    ).not.toBeInTheDocument()
  })
})
