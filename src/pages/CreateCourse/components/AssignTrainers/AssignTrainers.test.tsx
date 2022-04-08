import React from 'react'
import Router from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'
import { Course, CourseTrainer } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, within, waitForCalls, userEvent } from '@test/index'
import {
  buildCourse,
  buildCourseAssistant,
  buildCourseLeader,
} from '@test/mock-data-utils'

import { AssignTrainers } from './AssignTrainers'

const mockNavigate = jest.fn()
const useParamsMock = jest.spyOn(Router, 'useParams')
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockFetcher = jest.fn()
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: () => mockFetcher,
}))

jest.mock('@app/hooks/useCourse')
const mockUseCourse = jest.mocked(useCourse)
const mutate = jest.fn()

const placeholder = 'Search eligible trainers...'
const selectedTestId = 'SearchTrainers-selected'

describe('component: AssignTrainers', () => {
  it('renders as loading initially', async () => {
    const course = buildCourse()
    useParamsMock.mockReturnValue({ courseId: course.id })
    mockUseCourseResponse(undefined, LoadingStatus.FETCHING)

    render(<AssignTrainers />)
    await waitForCalls(mockUseCourse)

    expect(mockUseCourse).toBeCalledWith(course.id)
    expect(mockNavigate).not.toBeCalled()
    expect(screen.queryByTestId('AssignTrainers-loading')).toBeInTheDocument()
    expect(screen.queryByTestId('AssignTrainers-alert')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-form')).toBeNull()
  })

  it('renders alert if course is not found', async () => {
    const course = buildCourse()
    useParamsMock.mockReturnValue({ courseId: course.id })
    mockUseCourseResponse()

    render(<AssignTrainers />)
    await waitForCalls(mockUseCourse)

    expect(mockUseCourse).toBeCalledWith(course.id)
    expect(screen.queryByTestId('AssignTrainers-loading')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-alert')).toBeInTheDocument()
    expect(screen.queryByTestId('AssignTrainers-form')).toBeNull()
  })

  it('renders form if course is found', async () => {
    const overrides = { max_participants: 11, trainers: [] }
    const course = buildCourse({ overrides })
    useParamsMock.mockReturnValue({ courseId: course.id })
    mockUseCourseResponse(course)

    render(<AssignTrainers />)
    await waitForCalls(mockUseCourse)

    expect(mockUseCourse).toBeCalledWith(course.id)
    expect(screen.queryByTestId('AssignTrainers-loading')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-alert')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-form')).toBeInTheDocument()

    const lead = screen.getByTestId('AssignTrainers-lead')
    const leadInput = within(lead).getByPlaceholderText(placeholder)
    expect(leadInput).toBeInTheDocument()
    expect(leadInput).toHaveValue('')
    expect(leadInput).not.toBeDisabled()

    const picked = within(lead).queryAllByTestId(selectedTestId)
    expect(picked).toEqual([])

    // Not enough participants
    expect(screen.queryByTestId('AssignTrainers-assistant')).toBeNull()

    expect(screen.getByTestId('AssignTrainers-submit')).toBeDisabled()
  })

  it('shows assistants when participants are enough', async () => {
    const overrides = { max_participants: 12, trainers: [] }
    const course = buildCourse({ overrides })
    useParamsMock.mockReturnValue({ courseId: course.id })
    mockUseCourseResponse(course)

    render(<AssignTrainers />)
    await waitForCalls(mockUseCourse)

    const lead = screen.getByTestId('AssignTrainers-lead')
    expect(lead).toBeInTheDocument()

    const assist = screen.getByTestId('AssignTrainers-assist')
    const assistInput = within(assist).getByPlaceholderText(placeholder)
    expect(assistInput).toBeInTheDocument()
    expect(assistInput).toHaveValue('')
    expect(assistInput).not.toBeDisabled()

    const assistHint = within(assist).getByTestId('AssignTrainers-assist-hint')
    expect(assistHint).toHaveTextContent(
      'At least one assistant trainer needed'
    )

    const picked = within(assist).queryAllByTestId(selectedTestId)
    expect(picked).toStrictEqual([])

    expect(screen.getByTestId('AssignTrainers-submit')).toBeDisabled()
  })

  it('populates fields with existing data', async () => {
    const leadTrainer = buildCourseLeader()
    const assistTrainer1 = buildCourseAssistant()
    const assistTrainer2 = buildCourseAssistant()
    const course = buildCourse({
      overrides: { trainers: [leadTrainer, assistTrainer1, assistTrainer2] },
    })

    useParamsMock.mockReturnValue({ courseId: course.id })
    mockUseCourseResponse(course)

    render(<AssignTrainers />)
    await waitForCalls(mockUseCourse)

    const lead = screen.getByTestId('AssignTrainers-lead')
    const leadPicked = within(lead).queryAllByTestId(selectedTestId)
    expect(leadPicked).toHaveLength(1)
    expect(leadPicked[0]).toHaveTextContent(leadTrainer.profile.fullName)

    const assist = screen.getByTestId('AssignTrainers-assist')
    const assistPicked = within(assist).queryAllByTestId(selectedTestId)
    expect(assistPicked).toHaveLength(2)
    expect(assistPicked[0]).toHaveTextContent(assistTrainer1.profile.fullName)
    expect(assistPicked[1]).toHaveTextContent(assistTrainer2.profile.fullName)

    expect(screen.getByTestId('AssignTrainers-submit')).not.toBeDisabled()
  })

  it('submits when form is valid', async () => {
    const leadTrainer = buildCourseLeader()
    const assistTrainer = buildCourseAssistant()
    const course = buildCourse({
      overrides: { trainers: [leadTrainer, assistTrainer] },
    })

    useParamsMock.mockReturnValue({ courseId: course.id })
    mockUseCourseResponse(course)

    render(<AssignTrainers />)
    await waitForCalls(mockUseCourse)

    const submitBtn = screen.getByTestId('AssignTrainers-submit')
    userEvent.click(submitBtn)

    await waitForCalls(mockNavigate)

    expect(mockFetcher).toBeCalledWith(
      expect.stringContaining('mutation SetCourseTrainers'),
      {
        courseId: course.id,
        trainers: [
          courseTrainerToInput(leadTrainer, course.id),
          courseTrainerToInput(assistTrainer, course.id),
        ],
      }
    )

    expect(mockNavigate).toBeCalledWith('/courses')
  })
})

/**
 * Helpers
 */

function courseTrainerToInput(t: CourseTrainer, course_id: number) {
  return { course_id, profile_id: t.profile.id, type: t.type }
}

function mockUseCourseResponse(
  course?: Course,
  status = LoadingStatus.SUCCESS
) {
  return mockUseCourse.mockReturnValue({
    data: course,
    status,
    mutate,
  })
}
