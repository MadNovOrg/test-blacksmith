import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  SearchTrainersQuery,
} from '@app/generated/graphql'
import {
  CourseTrainerType,
  SearchTrainer,
  TrainerRoleTypeName,
} from '@app/types'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { SearchTrainers } from './SearchTrainers'

describe(SearchTrainers.name, () => {
  const urqlMockClient = {
    executeQuery: vi.fn(() => never),
  }
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
    const trainers = [
      {
        email: chance.email(),
        fullName: chance.name(),
        id: chance.guid(),
      },
      {
        email: chance.email(),
        fullName: chance.name(),
        id: chance.guid(),
      },
      {
        email: chance.email(),
        fullName: chance.name(),
        id: chance.guid(),
      },
    ] as SearchTrainersQuery['trainers']
    const course = buildCourse()
    urqlMockClient.executeQuery.mockImplementationOnce(() =>
      fromValue<{ data: SearchTrainersQuery }>({
        data: {
          trainers,
        },
      })
    )

    // Act
    render(
      <Provider value={urqlMockClient as unknown as Client}>
        <SearchTrainers
          trainerType={CourseTrainerType.Leader}
          courseLevel={Course_Level_Enum.Level_1}
          courseSchedule={course.schedule[0]}
          courseType={Course_Type_Enum.Open}
        />
      </Provider>
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    const shortQuery = trainers?.length ? trainers[0]?.fullName.slice(0, 3) : ''
    await userEvent.type(input, shortQuery as string)
    expect(input).toHaveValue(shortQuery)

    await waitFor(async () => {
      expect(urqlMockClient.executeQuery).toHaveBeenCalledTimes(1)
    })
  })

  it('shows options matching search term', async () => {
    // Arrange
    const course = buildCourse()

    const lastName = 'Smith'
    urqlMockClient.executeQuery.mockImplementationOnce(() =>
      fromValue<{ data: SearchTrainersQuery }>({
        data: {
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
          ] as SearchTrainersQuery['trainers'],
        },
      })
    )

    // Act
    render(
      <Provider value={urqlMockClient as unknown as Client}>
        <SearchTrainers
          trainerType={CourseTrainerType.Leader}
          courseLevel={Course_Level_Enum.Level_1}
          courseSchedule={course.schedule[0]}
          courseType={Course_Type_Enum.Open}
        />
      </Provider>
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, lastName.slice(0, 4))

    await waitFor(() => {
      expect(urqlMockClient.executeQuery).toHaveBeenCalledTimes(1)
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

  it('enforces max selected items when max is set', async () => {
    // Arrange
    const course = buildCourse()

    const lastName = 'Smith'
    const trainers = [
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
    ]

    urqlMockClient.executeQuery.mockImplementationOnce(() =>
      fromValue<{ data: SearchTrainersQuery }>({
        data: {
          trainers: trainers as unknown as SearchTrainersQuery['trainers'],
        },
      })
    )

    // Act
    render(
      <Provider value={urqlMockClient as unknown as Client}>
        <SearchTrainers
          trainerType={CourseTrainerType.Leader}
          courseLevel={Course_Level_Enum.Level_1}
          courseSchedule={course.schedule[0]}
          max={1}
          courseType={Course_Type_Enum.Open}
        />
      </Provider>
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, lastName.slice(0, 4))
    await waitFor(async () => {
      expect(urqlMockClient.executeQuery).toHaveBeenCalledTimes(1)
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
    urqlMockClient.executeQuery.mockImplementationOnce(() =>
      fromValue<{ data: SearchTrainersQuery }>({
        data: {
          trainers: trainers as unknown as SearchTrainersQuery['trainers'],
        },
      })
    )

    const onChange = vi.fn()
    render(
      <Provider value={urqlMockClient as unknown as Client}>
        <SearchTrainers
          trainerType={CourseTrainerType.Leader}
          courseLevel={Course_Level_Enum.Level_1}
          courseSchedule={course.schedule[0]}
          onChange={onChange}
          courseType={Course_Type_Enum.Open}
        />
      </Provider>
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, trainers[2].fullName.slice(0, 4))

    await waitFor(
      async () => {
        expect(urqlMockClient.executeQuery).toHaveBeenCalledTimes(1)
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

    urqlMockClient.executeQuery.mockImplementationOnce(() =>
      fromValue<{ data: SearchTrainersQuery }>({
        data: {
          trainers: [],
        },
      })
    )

    // Act
    render(
      <Provider value={urqlMockClient as unknown as Client}>
        <SearchTrainers
          trainerType={CourseTrainerType.Leader}
          courseLevel={Course_Level_Enum.Level_1}
          courseSchedule={course.schedule[0]}
          courseType={Course_Type_Enum.Open}
        />
      </Provider>
    )

    // Assert
    const input = screen.getByTestId('SearchTrainers-input')

    await userEvent.type(input, chance.last().slice(0, 4))

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
