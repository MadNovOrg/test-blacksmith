import Chance from 'chance'

import {
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { CreateCourseProvider } from '@app/modules/course/pages/CreateCourse/components/CreateCourseProvider'
import { AwsRegions, TrainerInput, TransportMethod } from '@app/types'

import { render, screen, userEvent, waitFor, within, act } from '@test/index'

import TrainerExpensesForm from '.'

const chance = new Chance()

const makeTrainer = (type: Course_Trainer_Type_Enum): TrainerInput => ({
  fullName: chance.name(),
  profile_id: chance.guid(),
  type,
  levels: [],
  trainer_role_types: [],
})

const makeTrainers = ({
  lead,
  assistant,
  moderator,
}: {
  lead?: boolean
  assistant?: number
  moderator?: boolean
}): TrainerInput[] => {
  const leadTrainers = lead
    ? [makeTrainer(Course_Trainer_Type_Enum.Leader)]
    : []

  const assistantTrainers = assistant
    ? new Array(assistant)
        .fill(null)
        .map(() => makeTrainer(Course_Trainer_Type_Enum.Assistant))
    : []

  const moderators = moderator
    ? [makeTrainer(Course_Trainer_Type_Enum.Moderator)]
    : []

  return [...leadTrainers, ...assistantTrainers, ...moderators]
}

const selectTransportMethod = async (
  pid: string,
  index: number,
  option: TransportMethod,
) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const select = within(s).getByTestId(`trip-${index}-dropdown`)
  await userEvent.click(within(select).getByRole('button'))
  await waitFor(async () => {
    const opt = screen.getByTestId(`dropdown-menu-option-${option}`)
    await userEvent.click(opt)
  })
}

const fillValueForTrip = async (pid: string, index: number, value: string) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const input = within(s).getByTestId(`trip-${index}-input`)
  await userEvent.clear(input)
  await userEvent.type(input, value)
}

const fillFlightDaysForTrip = async (
  pid: string,
  index: number,
  value: string,
) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const input = within(s).getByTestId(`trip-${index}-flight-days`)
  await userEvent.clear(input)
  await userEvent.type(input, value)
}

const fillAccommodationNightsForTrip = async (
  pid: string,
  index: number,
  value: string,
) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const input = within(s).getByTestId(`trip-${index}-accommodation-nights`)
  await userEvent.clear(input)
  await userEvent.type(input, value)
}

const addNewTrip = async (pid: string) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const button = within(s).getByTestId('add-trip-button')
  await userEvent.click(button)
}

const deleteTrip = async (pid: string, index: number) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const button = within(s).getByTestId(`trip-${index}-delete-button`)
  await userEvent.click(button)
}

const toggleAccommodation = async (pid: string, index: number) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const toggleSwitch = within(
    within(s).getByTestId(`accommodation-${index}-switch`),
  ).getByRole('checkbox')
  await userEvent.click(toggleSwitch)
}

const runTestsForTrainer = async (trainer: TrainerInput) => {
  const pid = trainer.profile_id

  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByText(
      trainer.fullName as string,
      {
        exact: false,
      },
    ),
  ).toBeVisible()

  await selectTransportMethod(pid, 0, TransportMethod.CAR)

  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByLabelText(
      'Total mileage',
      { exact: false },
    ),
  ).toBeVisible()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId(
      'accommodation-0-switch',
    ),
  ).toBeVisible()

  await act(async () => {
    await fillValueForTrip(pid, 0, '777')
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-0-input'),
  ).toHaveValue(777)

  await act(async () => {
    await addNewTrip(pid)
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-1-dropdown'),
  ).toBeVisible()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByText('None', {
      exact: false,
    }),
  ).toBeVisible()

  await selectTransportMethod(pid, 1, TransportMethod.FLIGHTS)
  await fillValueForTrip(pid, 1, '123.53')
  await fillFlightDaysForTrip(pid, 1, '3')

  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-1-input'),
  ).toHaveValue(123.53)
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId(
      'trip-1-flight-days',
    ),
  ).toHaveValue(3)

  await addNewTrip(pid)
  await selectTransportMethod(pid, 2, TransportMethod.PRIVATE)
  await fillValueForTrip(pid, 2, '0.99')
  await toggleAccommodation(pid, 2)
  await fillAccommodationNightsForTrip(pid, 2, '2')

  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId(
      'accommodation-2-switch',
    ),
  ).toBeVisible()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-2-input'),
  ).toHaveValue(0.99)
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId(
      'trip-2-accommodation-nights',
    ),
  ).toHaveValue(2)

  await act(async () => {
    await deleteTrip(pid, 1)
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-0-dropdown'),
  ).toBeVisible()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).queryByTestId(
      'trip-1-dropdown',
    ),
  ).toBeNull()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-2-dropdown'),
  ).toBeVisible()

  expect(
    within(screen.getByTestId(`trainer-${pid}`)).queryByText('Flight', {
      exact: false,
    }),
  ).toBeNull()
}

const setup = (trainers: TrainerInput[]) =>
  waitFor(() =>
    render(
      <CreateCourseProvider courseType={Course_Type_Enum.Closed}>
        <TrainerExpensesForm trainers={trainers} />
      </CreateCourseProvider>,
    ),
  )

describe('component: TrainerExpensesForm', () => {
  // eslint-disable-next-line vitest/expect-expect
  it('allows inputting expenses for single trainer', async () => {
    const [trainer] = makeTrainers({ lead: true })
    await setup([trainer])

    await runTestsForTrainer(trainer)
  })

  it('allows inputting expenses for multiple trainers', async () => {
    const trainers = makeTrainers({ lead: true, assistant: 1, moderator: true })

    await setup(trainers)

    await runTestsForTrainer(trainers[0])
    await runTestsForTrainer(trainers[1])
    await runTestsForTrainer(trainers[2])

    await waitFor(() => {
      expect(screen.getAllByTestId('trip-0-dropdown')).toHaveLength(3)
    })
  }, 60000)

  it('does not show accomodation caption on ANZ', async () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)

    const trainers = makeTrainers({ lead: true, assistant: 1, moderator: true })
    const profileId = trainers[0].profile_id

    await setup(trainers)
    await selectTransportMethod(profileId, 0, TransportMethod.CAR)
    await act(async () => {
      await fillValueForTrip(profileId, 0, '777')
    })
    expect(
      within(screen.getByTestId(`trainer-${profileId}`)).getByTestId(
        'trip-0-input',
      ),
    ).toHaveValue(777)

    await toggleAccommodation(profileId, 0)
    expect(screen.queryByTestId('accomodation-caption')).not.toBeInTheDocument()
  })
  // Was timing out on CI ^
})
