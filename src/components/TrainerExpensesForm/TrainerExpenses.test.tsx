import Chance from 'chance'
import React from 'react'
import { act } from 'react-dom/test-utils'

import { CourseTrainerType, TransportMethod, TrainerInput } from '@app/types'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import TrainerExpensesForm from '.'

const chance = new Chance()

const makeTrainer = (type: CourseTrainerType) => ({
  fullName: chance.name(),
  profile_id: chance.guid(),
  type,
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
  const leadTrainers = lead ? [makeTrainer(CourseTrainerType.LEADER)] : []

  const assistantTrainers = assistant
    ? new Array(assistant)
        .fill(null)
        .map(() => makeTrainer(CourseTrainerType.ASSISTANT))
    : []

  const moderators = moderator ? [makeTrainer(CourseTrainerType.MODERATOR)] : []

  return [...leadTrainers, ...assistantTrainers, ...moderators]
}

const selectTransportMethod = async (
  pid: string,
  index: number,
  option: TransportMethod
) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const select = within(s).getByTestId(`trip-${index}-dropdown`)
  userEvent.click(within(select).getByRole('button'))
  await waitFor(() => {
    const opt = screen.getByTestId(`dropdown-menu-option-${option}`)
    userEvent.click(opt)
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
  value: string
) => {
  const s = screen.getByTestId(`trainer-${pid}`)

  const input = within(s).getByTestId(`trip-${index}-flight-days`)
  await userEvent.clear(input)
  await userEvent.type(input, value)
}

const fillAccommodationNightsForTrip = async (
  pid: string,
  index: number,
  value: string
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
    within(s).getByTestId(`accommodation-${index}-switch`)
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
      }
    )
  ).toBeVisible()

  await act(async () => {
    await selectTransportMethod(pid, 0, TransportMethod.CAR)
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByLabelText(
      'Total mileage',
      { exact: false }
    )
  ).toBeVisible()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId(
      'accommodation-0-switch'
    )
  ).toBeVisible()

  await act(async () => {
    await fillValueForTrip(pid, 0, '777')
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-0-input')
  ).toHaveValue(777)

  await act(async () => {
    await addNewTrip(pid)
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-1-dropdown')
  ).toBeVisible()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByText('None', {
      exact: false,
    })
  ).toBeVisible()

  await act(async () => {
    await selectTransportMethod(pid, 1, TransportMethod.FLIGHTS)
    await fillValueForTrip(pid, 1, '123.53')
    await fillFlightDaysForTrip(pid, 1, '3')
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-1-input')
  ).toHaveValue(123.53)
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId(
      'trip-1-flight-days'
    )
  ).toHaveValue(3)

  await act(async () => {
    await addNewTrip(pid)
    await selectTransportMethod(pid, 2, TransportMethod.PRIVATE)
    await fillValueForTrip(pid, 2, '0.99')
    await toggleAccommodation(pid, 2)
    await fillAccommodationNightsForTrip(pid, 2, '2')
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId(
      'accommodation-2-switch'
    )
  ).toBeVisible()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-2-input')
  ).toHaveValue(0.99)
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId(
      'trip-2-accommodation-nights'
    )
  ).toHaveValue(2)

  await act(async () => {
    await deleteTrip(pid, 1)
  })
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-0-dropdown')
  ).toBeVisible()
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).queryByTestId(
      'trip-1-dropdown'
    )
  ).toBe(null)
  expect(
    within(screen.getByTestId(`trainer-${pid}`)).getByTestId('trip-2-dropdown')
  ).toBeVisible()

  expect(
    within(screen.getByTestId(`trainer-${pid}`)).queryByText('Flight', {
      exact: false,
    })
  ).toBe(null)
}

describe('component: TrainerExpensesForm', () => {
  it('allows inputting expenses for single trainer', async () => {
    const [trainer] = makeTrainers({ lead: true })
    await waitFor(() => render(<TrainerExpensesForm trainers={[trainer]} />))

    await runTestsForTrainer(trainer)
  })

  it('allows inputting expenses for multiple trainers', async () => {
    const trainers = makeTrainers({ lead: true, assistant: 1, moderator: true })

    await waitFor(() => render(<TrainerExpensesForm trainers={trainers} />))

    await runTestsForTrainer(trainers[0])
    await runTestsForTrainer(trainers[1])
    await runTestsForTrainer(trainers[2])

    expect(screen.getAllByTestId('trip-0-dropdown')).toHaveLength(3)
  }, 60000)
  // Was timing out on CI ^
})
