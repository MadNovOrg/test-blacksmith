import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'

import { ParticipantCourse } from '.'

import {
  buildCourse,
  buildEndedCourse,
  buildNotStartedCourse,
  buildParticipant,
} from '@test/mock-data-utils'
import { LoadingStatus } from '@app/util'
import { render, screen } from '@test/index'

jest.mock('@app/hooks/useCourse')

const mockUseSWR = jest.fn()

jest.mock('swr', () => ({
  __esModule: true,
  default: () => mockUseSWR(),
}))

const useCourseMock = jest.mocked(useCourse)

describe('page: ParticipantCourse', () => {
  it('displays course hero info', () => {
    mockUseSWR.mockReturnValue({
      data: { course_participant: [buildParticipant()] },
    })

    const course = buildCourse()
    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <MemoryRouter initialEntries={[`/my-training/courses/${course.id}`]}>
        <Routes>
          <Route
            path={`/my-training/courses/:id`}
            element={<ParticipantCourse />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
    expect(
      screen.getByLabelText('You are attending this course')
    ).toBeInTheDocument()
    expect(screen.queryByTestId('success-alert')).not.toBeInTheDocument()
  })

  it('displays an alert if user has been redirected from accepting the invite', () => {
    mockUseSWR.mockReturnValue({
      data: { course_participant: [buildParticipant()] },
    })
    const course = buildCourse()
    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })
    render(
      <MemoryRouter
        initialEntries={[
          `/my-training/courses/${course.id}?success=invite_accepted`,
        ]}
      >
        <Routes>
          <Route
            path={`/my-training/courses/:id`}
            element={<ParticipantCourse />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('success-alert')).toBeInTheDocument()
  })

  it('displays tabs with course checklist and resources', () => {
    mockUseSWR.mockReturnValue({
      data: { course_participant: [buildParticipant()] },
    })

    const course = buildCourse()
    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })
    render(
      <MemoryRouter initialEntries={[`/my-training/courses/${course.id}`]}>
        <Routes>
          <Route
            path={`/my-training/courses/:id`}
            element={<ParticipantCourse />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Course participant tabs')).toBeInTheDocument()
    expect(screen.getByLabelText('Course checklist')).toBeInTheDocument()
    expect(screen.getByLabelText('Resources')).toBeInTheDocument()
  })

  it('has course evaluation button disabled if course has not started yet', () => {
    mockUseSWR.mockReturnValue({
      data: { course_participant: [buildParticipant()] },
    })

    const course = buildNotStartedCourse()
    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <MemoryRouter initialEntries={[`/my-training/courses/${course.id}`]}>
        <Routes>
          <Route
            path={`/my-training/courses/:id`}
            element={<ParticipantCourse />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('evaluate-course-cta')).toBeDisabled()
  })

  it('has course evaluation button enabled if course has ended', () => {
    mockUseSWR.mockReturnValue({
      data: { course_participant: [buildParticipant()] },
    })

    const course = buildEndedCourse()
    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <MemoryRouter initialEntries={[`/my-training/courses/${course.id}`]}>
        <Routes>
          <Route
            path={`/my-training/courses/:id`}
            element={<ParticipantCourse />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('evaluate-course-cta')).toBeEnabled()
  })
})
