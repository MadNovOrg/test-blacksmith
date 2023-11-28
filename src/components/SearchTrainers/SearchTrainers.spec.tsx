import React from 'react'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import {
  CourseTrainerType,
  SearchTrainer,
  TrainerRoleTypeName,
} from '@app/types'

import {
  chance,
  render,
  screen,
  userEvent,
  waitFor,
  waitForCalls,
  within,
} from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { SearchTrainers } from './SearchTrainers'

const mockSearch = vi.fn().mockResolvedValue({ trainers: [] })
vi.mock('./useQueryTrainers.ts', () => ({
  useQueryTrainers: () => ({ search: mockSearch }),
}))

describe(SearchTrainers.name, () => {
  it('renders as expected', async () => {
    // Arrange
    const course = buildCourse()

    // Act
    const { container } = render(
      <SearchTrainers
        trainerType={CourseTrainerType.Leader}
        courseLevel={Course_Level_Enum.Level_1}
        courseSchedule={course.schedule[0]}
        courseType={Course_Type_Enum.Open}
      />
    )

    // Assert
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
    // Arrange
    const course = buildCourse()

    const placeholder = chance.sentence()

    // Act
    render(
      <SearchTrainers
        trainerType={CourseTrainerType.Leader}
        courseLevel={Course_Level_Enum.Level_1}
        courseSchedule={course.schedule[0]}
        placeholder={placeholder}
        courseType={Course_Type_Enum.Open}
      />
    )

    // Assert
    const input = screen.getByPlaceholderText(placeholder)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('calls search trainers when input term length is >= 3', async () => {
    // Arrange
    const course = buildCourse()

    // Act
    const { container } = render(
      <SearchTrainers
        trainerType={CourseTrainerType.Leader}
        courseLevel={Course_Level_Enum.Level_1}
        courseSchedule={course.schedule[0]}
        courseType={Course_Type_Enum.Open}
      />
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    const loadingIcon = container.querySelector('.MuiCircularProgress-root')
    expect(loadingIcon).toHaveClass('MuiCircularProgress-determinate') // paused

    const shortQuery = chance.last().slice(0, 3)
    await userEvent.type(input, shortQuery)
    expect(input).toHaveValue(shortQuery)

    await userEvent.clear(input)

    const enoughQuery = chance.last().slice(0, 4)
    await userEvent.type(input, enoughQuery)

    expect(loadingIcon).toHaveClass('MuiCircularProgress-indeterminate') // loading

    await waitForCalls(mockSearch)
    expect(mockSearch).toHaveBeenCalledWith(enoughQuery)

    await waitFor(async () => {
      expect(loadingIcon).toHaveClass('MuiCircularProgress-determinate') // paused
    })
  })

  it('shows options matching search term', async () => {
    // Arrange
    const course = buildCourse()

    const lastName = 'Smith'
    mockSearch.mockResolvedValueOnce({
      trainers: [
        {
          id: chance.guid(),
          fullName: `John Mc${lastName}`,
          trainer_role_types: [
            {
              trainer_role_type: {
                id: '0',
                name: TrainerRoleTypeName.PRINCIPAL,
              },
            },
          ],
        },
        {
          id: chance.guid(),
          fullName: `Ivan ${lastName}ovich`,
          trainer_role_types: [],
        },
        {
          id: chance.guid(),
          fullName: `Coen De${lastName}`,
          trainer_role_types: [],
        },
        {
          id: chance.guid(),
          fullName: `Mary NotAMatch`,
          trainer_role_types: [],
        },
      ],
    })

    // Act
    render(
      <SearchTrainers
        trainerType={CourseTrainerType.Leader}
        courseLevel={Course_Level_Enum.Level_1}
        courseSchedule={course.schedule[0]}
        courseType={Course_Type_Enum.Open}
      />
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, lastName.slice(0, 4))

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledTimes(1)

      expect(screen.getAllByTestId('SearchTrainers-option')).toHaveLength(3)
      expect(
        within(screen.getAllByTestId('SearchTrainers-option')[0]).getByText(
          'John McSmith'
        )
      ).toBeInTheDocument()
      expect(
        within(screen.getAllByTestId('SearchTrainers-option')[0]).getByText(
          'Principal'
        )
      ).toBeInTheDocument()
    })
  })

  it('calls matchesFilter to further filter options', async () => {
    // Arrange
    const course = buildCourse()

    const trainers = makeTrainers()
    mockSearch.mockResolvedValueOnce({ trainers })

    const matchesFilter = vi.fn().mockReturnValueOnce([trainers[2]])
    render(
      <SearchTrainers
        trainerType={CourseTrainerType.Leader}
        courseLevel={Course_Level_Enum.Level_1}
        courseSchedule={course.schedule[0]}
        matchesFilter={matchesFilter}
        courseType={Course_Type_Enum.Open}
      />
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, trainers[2].fullName.slice(0, 4))

    await waitForCalls(mockSearch)

    expect(matchesFilter).toHaveBeenCalledWith(trainers)

    await waitFor(async () => {
      expect(screen.getAllByTestId('SearchTrainers-option')).toHaveLength(1)
    })
  })

  it('enforces max selected items when max is set', async () => {
    // Arrange
    const course = buildCourse()

    const lastName = 'Smith'
    mockSearch.mockResolvedValueOnce({
      trainers: [
        {
          id: chance.guid(),
          fullName: `John Mc${lastName}`,
          trainer_role_types: [],
          levels: [],
        },
        {
          id: chance.guid(),
          fullName: `Ivan ${lastName}ovich`,
          trainer_role_types: [],
          levels: [],
        },
        {
          id: chance.guid(),
          fullName: `Coen De${lastName}`,
          trainer_role_types: [],
          levels: [],
        },
        {
          id: chance.guid(),
          fullName: `Mary NotAMatch`,
          trainer_role_types: [],
          levels: [],
        },
      ],
    })

    // Act
    render(
      <SearchTrainers
        trainerType={CourseTrainerType.Leader}
        courseLevel={Course_Level_Enum.Level_1}
        courseSchedule={course.schedule[0]}
        max={1}
        courseType={Course_Type_Enum.Open}
      />
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, lastName.slice(0, 4))

    await waitForCalls(mockSearch)
    await waitFor(async () => {
      const matches = screen.getAllByTestId('SearchTrainers-option')
      expect(matches).toHaveLength(3)
      await userEvent.click(matches[0])

      expect(input).toBeDisabled()
      expect(screen.getByPlaceholderText('(max allowed reached)')).toBe(input)
    })
  })

  it('calls onChange when a trainer is selected', async () => {
    // Arrange
    const course = buildCourse()

    const trainers = makeTrainers()
    mockSearch.mockResolvedValueOnce({ trainers })

    const onChange = vi.fn()
    render(
      <SearchTrainers
        trainerType={CourseTrainerType.Leader}
        courseLevel={Course_Level_Enum.Level_1}
        courseSchedule={course.schedule[0]}
        onChange={onChange}
        courseType={Course_Type_Enum.Open}
      />
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, trainers[2].fullName.slice(0, 4))

    await waitForCalls(mockSearch)
    await waitFor(
      async () => {
        const matches = screen.getAllByTestId('SearchTrainers-option')
        expect(matches).toHaveLength(1)
        await userEvent.click(matches[0])

        expect(onChange).toHaveBeenCalledWith({
          target: { value: [trainers[2]] },
        })
      },
      { timeout: 3000, interval: 300 }
    )
  })

  it('shows info message when no matches are found', async () => {
    // Arrange
    const course = buildCourse()

    mockSearch.mockResolvedValueOnce({ trainers: [] })

    // Act
    render(
      <SearchTrainers
        trainerType={CourseTrainerType.Leader}
        courseLevel={Course_Level_Enum.Level_1}
        courseSchedule={course.schedule[0]}
        courseType={Course_Type_Enum.Open}
      />
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, chance.last().slice(0, 4))

    await waitForCalls(mockSearch)

    await waitFor(async () => {
      const noMatchTxt = 'No trainers found. Try another search term.'
      expect(screen.getByText(noMatchTxt)).toBeInTheDocument()
    })
  })
})

/**
 * Helpers ----
 */

function makeTrainers(): SearchTrainer[] {
  return [
    {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: '',
      trainer_role_types: [],
      levels: [],
    },
    {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: '',
      trainer_role_types: [],
      levels: [],
    },
    {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: '',
      trainer_role_types: [],
      levels: [],
    },
    {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: '',
      trainer_role_types: [],
      levels: [],
    },
  ]
}
