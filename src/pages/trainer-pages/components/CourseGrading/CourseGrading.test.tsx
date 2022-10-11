import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { Grade } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, userEvent, waitFor } from '@test/index'
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

    render(
      <MemoryRouter>
        <CourseGrading course={course} />
      </MemoryRouter>
    )

    expect(screen.getByTestId('course-fetching')).toBeInTheDocument()
  })

  it('displays grading table with all participants', () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    const participants = [
      { ...buildParticipant(), attended: false, grade: Grade.FAIL },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter>
        <CourseGrading course={course} />
      </MemoryRouter>
    )

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
      { ...buildParticipant(), attended: false, grade: Grade.FAIL },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<CourseGrading course={course} />}
          />
          <Route
            path="/courses/:id/grading-details"
            element={<h1>Grading clearance</h1>}
          />
        </Routes>
      </MemoryRouter>
    )
    const button = screen.getByRole('button', {
      name: 'Modify grading details',
    })
    expect(button).toBeInTheDocument()
    userEvent.click(button)
    await waitFor(() =>
      expect(screen.getByText('Grading clearance')).toBeInTheDocument()
    )
  })

  it('disables button to modify grading details if grading has started', async () => {
    const course = buildCourse()
    course.gradingConfirmed = true
    course.gradingStarted = true
    const participants = [
      { ...buildParticipant(), attended: false, grade: Grade.FAIL },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]
    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter>
        <CourseGrading course={course} />
      </MemoryRouter>
    )
    const button = screen.getByRole('button', {
      name: 'Modify grading details',
    })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })
})
