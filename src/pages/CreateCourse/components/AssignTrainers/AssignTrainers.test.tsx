import React from 'react'

import { RoleName, ValidCourseInput } from '@app/types'
import { courseToCourseInput } from '@app/util'

import { render, screen, within } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { AssignTrainers } from './AssignTrainers'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockFetcher = jest.fn()
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: () => mockFetcher,
}))

const placeholder = 'Search eligible trainers...'
const selectedTestId = 'SearchTrainers-selected'

describe('component: AssignTrainers', () => {
  it('renders alert if course is not found', () => {
    render(
      <CreateCourseProvider>
        <AssignTrainers />
      </CreateCourseProvider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    expect(screen.queryByTestId('AssignTrainers-loading')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-alert')).toBeInTheDocument()
    expect(screen.queryByTestId('AssignTrainers-form')).toBeNull()
  })

  it('renders form if course data is in context', () => {
    const overrides = { max_participants: 11, trainers: [] }
    const course = buildCourse({ overrides })

    render(
      <CreateCourseProvider
        initialValue={courseToCourseInput(course) as ValidCourseInput}
      >
        <AssignTrainers />
      </CreateCourseProvider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    expect(screen.queryByTestId('AssignTrainers-loading')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-alert')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-form')).toBeInTheDocument()
  })

  it('shows assistants when participants are enough', async () => {
    const overrides = { max_participants: 12, trainers: [] }
    const course = buildCourse({ overrides })

    render(
      <CreateCourseProvider
        initialValue={courseToCourseInput(course) as ValidCourseInput}
      >
        <AssignTrainers />
      </CreateCourseProvider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

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
})
