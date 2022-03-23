import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'

import { ParticipantCourse } from '.'

import {
  buildCourse,
  buildEndedCourse,
  buildNotStartedCourse,
} from '@test/mock-data-utils'
import { LoadingStatus } from '@app/util'
import { render, screen } from '@test/index'

jest.mock('@app/hooks/useCourse')

const useCourseMock = jest.mocked(useCourse)

describe('page: ParticipantCourse', () => {
  it('displays course hero info', () => {
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
    expect(
      screen.queryByTestId('accepted-invite-alert')
    ).not.toBeInTheDocument()
  })

  it('displays an alert if user has been redirected from accepting the invite', () => {
    const course = buildCourse()
    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })
    render(
      <MemoryRouter
        initialEntries={[
          `/my-training/courses/${course.id}?acceptedInvite=true`,
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

    expect(screen.getByTestId('accepted-invite-alert')).toBeInTheDocument()
  })

  it('displays tabs with course checklist and resources', () => {
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
