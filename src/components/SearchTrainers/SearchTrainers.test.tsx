import React from 'react'

import {
  InviteStatus,
  SearchTrainer,
  SearchTrainerAvailability,
} from '@app/types'

import { render, screen, chance, userEvent, waitForCalls } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { setAvailability } from './helpers'
import { SearchTrainers } from './SearchTrainers'
import { SearchTrainerBookings } from './types'

const mockSearch = jest.fn().mockResolvedValue({ trainers: [] })
jest.mock('./useQueryTrainers.ts', () => ({
  useQueryTrainers: () => ({ search: mockSearch }),
}))

describe('component: SearchTrainers', () => {
  it('renders as expected', async () => {
    const course = buildCourse()

    const { container } = render(
      <SearchTrainers courseSchedule={course.schedule[0]} />
    )

    const input = screen.getByTestId('SearchTrainers-input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')

    const searchIcon = screen.getByTestId('SearchTrainers-input-icon')
    expect(searchIcon).toBeInTheDocument()

    const loadingIcon = container.querySelector('.MuiCircularProgress-root')
    expect(loadingIcon).toBeInTheDocument()
    expect(loadingIcon).toHaveClass('MuiCircularProgress-determinate') // paused
  })

  it('uses provided placeholder', async () => {
    const course = buildCourse()

    const placeholder = chance.sentence()
    render(
      <SearchTrainers
        courseSchedule={course.schedule[0]}
        placeholder={placeholder}
      />
    )

    const input = screen.getByPlaceholderText(placeholder)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('calls search trainers when input term length is >= 3', async () => {
    const course = buildCourse()

    const { container } = render(
      <SearchTrainers courseSchedule={course.schedule[0]} />
    )
    const input = screen.getByTestId('SearchTrainers-input')
    const loadingIcon = container.querySelector('.MuiCircularProgress-root')

    expect(loadingIcon).toHaveClass('MuiCircularProgress-determinate') // paused

    const shortQuery = chance.last().slice(0, 3)
    userEvent.type(input, shortQuery)
    expect(input).toHaveValue(shortQuery)
    expect(mockSearch).not.toBeCalled()

    userEvent.clear(input)

    const enoughQuery = chance.last().slice(0, 4)
    userEvent.type(input, enoughQuery)

    expect(loadingIcon).toHaveClass('MuiCircularProgress-indeterminate') // loading

    await waitForCalls(mockSearch)
    expect(mockSearch).toBeCalledWith(enoughQuery)

    expect(loadingIcon).toHaveClass('MuiCircularProgress-determinate') // paused
  })

  it('shows options matching search term', async () => {
    const course = buildCourse()

    const lastName = 'Smith'
    mockSearch.mockResolvedValueOnce({
      trainers: [
        { id: chance.guid(), fullName: `John Mc${lastName}` },
        { id: chance.guid(), fullName: `Ivan ${lastName}ovich` },
        { id: chance.guid(), fullName: `Coen De${lastName}` },
        { id: chance.guid(), fullName: `Mary NotAMatch` },
      ],
    })

    render(<SearchTrainers courseSchedule={course.schedule[0]} />)
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, lastName.slice(0, 4))

    await waitForCalls(mockSearch)
    expect(screen.getAllByTestId('SearchTrainers-option')).toHaveLength(3)
  })

  it('calls matchesFilter to further filter options', async () => {
    const course = buildCourse()

    const trainers = makeTrainers()
    mockSearch.mockResolvedValueOnce({ trainers })

    const matchesFilter = jest.fn().mockReturnValueOnce([trainers[2]])
    render(
      <SearchTrainers
        courseSchedule={course.schedule[0]}
        matchesFilter={matchesFilter}
      />
    )
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, trainers[2].fullName.slice(0, 4))

    await waitForCalls(mockSearch)

    expect(matchesFilter).toHaveBeenCalledWith(trainers)

    expect(screen.getAllByTestId('SearchTrainers-option')).toHaveLength(1)
  })

  it('enforces max selected items when max is set', async () => {
    const course = buildCourse()

    const lastName = 'Smith'
    mockSearch.mockResolvedValueOnce({
      trainers: [
        { id: chance.guid(), fullName: `John Mc${lastName}` },
        { id: chance.guid(), fullName: `Ivan ${lastName}ovich` },
        { id: chance.guid(), fullName: `Coen De${lastName}` },
        { id: chance.guid(), fullName: `Mary NotAMatch` },
      ],
    })

    render(<SearchTrainers courseSchedule={course.schedule[0]} max={1} />)
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, lastName.slice(0, 4))

    await waitForCalls(mockSearch)
    const matches = screen.getAllByTestId('SearchTrainers-option')
    expect(matches).toHaveLength(3)
    userEvent.click(matches[0])

    expect(input).toBeDisabled()
    expect(screen.getByPlaceholderText('(max allowed reached)')).toBe(input)
  })

  it('calls onChange when a trainer is selected', async () => {
    const course = buildCourse()

    const trainers = makeTrainers()
    mockSearch.mockResolvedValueOnce({ trainers })

    const onChange = jest.fn()
    render(
      <SearchTrainers courseSchedule={course.schedule[0]} onChange={onChange} />
    )
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, trainers[2].fullName.slice(0, 4))

    await waitForCalls(mockSearch)
    const matches = screen.getAllByTestId('SearchTrainers-option')
    expect(matches).toHaveLength(1)
    userEvent.click(matches[0])

    expect(onChange).toBeCalledWith({ target: { value: [trainers[2]] } })
  })

  it('shows info message when no matches are found', async () => {
    const course = buildCourse()

    mockSearch.mockResolvedValueOnce({ trainers: [] })

    render(<SearchTrainers courseSchedule={course.schedule[0]} />)
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, chance.last().slice(0, 4))

    await waitForCalls(mockSearch)

    const noMatchTxt = 'No trainers found. Try another search term.'
    expect(screen.getByText(noMatchTxt)).toBeInTheDocument()
  })

  describe('setAvailability', () => {
    it('should not fail when trainers is empty array', () => {
      const trainers: SearchTrainer[] = []
      const schedules: SearchTrainerBookings[] = []

      setAvailability(trainers, schedules)

      expect(trainers.length).toBe(0)
    })

    it('should set availability AVAILABLE when no trainers are booked', () => {
      const trainers = makeTrainers()
      const schedules: SearchTrainerBookings[] = []

      setAvailability(trainers, schedules)

      expect(trainers.length).toBe(4)
      trainers.forEach(t => {
        expect(t.availability).toBe(SearchTrainerAvailability.AVAILABLE)
      })
    })

    it('should set availability AVAILABLE when trainer has only declined bookings', () => {
      const trainers = makeTrainers()
      const schedules: SearchTrainerBookings[] = [
        makeSchedule(trainers[0].id, InviteStatus.DECLINED),
      ]

      setAvailability(trainers, schedules)

      expect(trainers.length).toBe(4)
      trainers.forEach(t => {
        expect(t.availability).toBe(SearchTrainerAvailability.AVAILABLE)
      })
    })

    it('should set availability UNAVAILABLE when trainer has accepted bookings', () => {
      const trainers = makeTrainers()
      const schedules: SearchTrainerBookings[] = [
        makeSchedule(trainers[0].id, InviteStatus.ACCEPTED),
      ]

      setAvailability(trainers, schedules)

      expect(trainers[0].availability).toBe(
        SearchTrainerAvailability.UNAVAILABLE
      )
      trainers.slice(1).forEach(t => {
        expect(t.availability).toBe(SearchTrainerAvailability.AVAILABLE)
      })
    })

    it('should set availability PENDING when trainer hasnt yet accepted/declined', () => {
      const trainers = makeTrainers()
      const schedules: SearchTrainerBookings[] = [
        makeSchedule(trainers[0].id, InviteStatus.PENDING),
      ]

      setAvailability(trainers, schedules)

      expect(trainers[0].availability).toBe(SearchTrainerAvailability.PENDING)
      trainers.slice(1).forEach(t => {
        expect(t.availability).toBe(SearchTrainerAvailability.AVAILABLE)
      })
    })

    it('should set availability UNAVAILABLE when trainer has mixed statuses', () => {
      const trainers = makeTrainers()
      const schedules: SearchTrainerBookings[] = [
        makeSchedule(trainers[0].id, InviteStatus.DECLINED),
        makeSchedule(trainers[1].id, InviteStatus.PENDING),
        makeSchedule(trainers[0].id, InviteStatus.PENDING),
        makeSchedule(trainers[0].id, InviteStatus.ACCEPTED),
      ]

      setAvailability(trainers, schedules)

      expect(trainers[0].availability).toBe(
        SearchTrainerAvailability.UNAVAILABLE
      )
      expect(trainers[1].availability).toBe(SearchTrainerAvailability.PENDING)
      trainers.slice(2).forEach(t => {
        expect(t.availability).toBe(SearchTrainerAvailability.AVAILABLE)
      })
    })
  })
})

/**
 * Helpers ----
 */

function makeTrainers(): SearchTrainer[] {
  return [
    { id: chance.guid(), fullName: chance.name(), avatar: '' },
    { id: chance.guid(), fullName: chance.name(), avatar: '' },
    { id: chance.guid(), fullName: chance.name(), avatar: '' },
    { id: chance.guid(), fullName: chance.name(), avatar: '' },
  ]
}

function makeSchedule(profile_id: string, status: InviteStatus) {
  return {
    profile_id,
    status,
    course: { schedule: [{ start: '', end: '' }] },
  }
}
