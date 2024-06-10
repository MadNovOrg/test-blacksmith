import { TypedQueryDocumentNode } from 'graphql'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  ToggleAttendanceMutation,
  ToggleAttendanceMutationVariables,
} from '@app/generated/graphql'

import { chance, render, screen, userEvent } from '@test/index'

import { AttendingToggle, toggleAttendanceMutation } from './AttendingToggle'

it('displays N/A if there is no information if participant attended a course or not', () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <AttendingToggle participant={{ id: chance.guid(), attended: null }} />
    </Provider>
  )

  expect(screen.getByRole('button', { name: 'N/A' })).toBeInTheDocument()
})

it('marks the chip as disabled', () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <AttendingToggle
        participant={{ id: chance.guid(), attended: null }}
        disabled
      />
    </Provider>
  )

  expect(screen.getByRole('button', { name: 'N/A' })).toHaveAttribute(
    'aria-disabled',
    'true'
  )
})

it('displays Attended chip if a participant attended a course', () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <AttendingToggle participant={{ id: chance.guid(), attended: true }} />
    </Provider>
  )

  expect(screen.getByRole('button', { name: /attended/i })).toBeInTheDocument()
})

it("displays Did not attend chip if a participant didn't attend a course", () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <AttendingToggle participant={{ id: chance.guid(), attended: false }} />
    </Provider>
  )

  expect(
    screen.getByRole('button', { name: /did not attend/i })
  ).toBeInTheDocument()
})

it('toggles attendance when chip is clicked', async () => {
  const participantId = chance.guid()

  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: ToggleAttendanceMutationVariables
      query: TypedQueryDocumentNode
    }) => {
      return fromValue<{ data: ToggleAttendanceMutation }>({
        data: {
          update_course_participant_by_pk:
            participantId === variables.participantId &&
            query === toggleAttendanceMutation
              ? {
                  attended: variables.attended,
                }
              : null,
        },
      })
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <AttendingToggle participant={{ id: participantId, attended: null }} />
    </Provider>
  )

  await userEvent.click(screen.getByRole('button', { name: 'N/A' }))

  expect(screen.getByRole('button', { name: /attended/i }))

  await userEvent.click(screen.getByRole('button', { name: /attended/i }))

  expect(screen.getByRole('button', { name: /did not attend/i }))
})

it('updates attendance chip after toggling', async () => {
  const participantId = chance.guid()

  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: ToggleAttendanceMutationVariables
      query: TypedQueryDocumentNode
    }) => {
      return fromValue<{ data: ToggleAttendanceMutation }>({
        data: {
          update_course_participant_by_pk:
            participantId === variables.participantId &&
            query === toggleAttendanceMutation
              ? {
                  attended: variables.attended,
                }
              : null,
        },
      })
    },
  } as unknown as Client

  const { rerender } = render(
    <Provider value={client}>
      <AttendingToggle participant={{ id: participantId, attended: null }} />
    </Provider>
  )

  await userEvent.click(screen.getByRole('button', { name: 'N/A' }))

  expect(screen.getByRole('button', { name: /attended/i }))

  rerender(
    <Provider value={client}>
      <AttendingToggle participant={{ id: participantId, attended: false }} />
    </Provider>
  )

  expect(screen.getByRole('button', { name: /did not attend/i }))
})
