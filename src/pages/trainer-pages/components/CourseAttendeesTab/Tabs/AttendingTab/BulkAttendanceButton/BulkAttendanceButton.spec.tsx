import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  ToggleSelectedParticipantsAttendanceMutation,
  ToggleSelectedParticipantsAttendanceMutationVariables,
} from '@app/generated/graphql'

import { chance, render, screen, userEvent } from '@test/index'

import {
  BulkAttendanceButton,
  toggleSelectedParticipantsAttendance,
} from './BulkAttendanceButton'

it('disables button if prop is passed', () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <BulkAttendanceButton
        courseId={1}
        disabled
        participantIds={[chance.guid()]}
      />
    </Provider>
  )

  expect(
    screen.getByRole('button', { name: /mark attendance/i })
  ).toBeDisabled()
})

it('disables button if no participants are selected', () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <BulkAttendanceButton courseId={1} participantIds={[]} />
    </Provider>
  )

  expect(
    screen.getByRole('button', { name: /mark attendance/i })
  ).toBeDisabled()
})

it('renders correct menu items', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <BulkAttendanceButton courseId={1} participantIds={[chance.guid()]} />
    </Provider>
  )

  await userEvent.click(
    screen.getByRole('button', { name: /mark attendance/i })
  )

  expect(screen.getByRole('menuitem', { name: /attended/i }))
  expect(screen.getByRole('menuitem', { name: /did not attend/i }))
})

it('marks selected participants as attended when option is selected', async () => {
  const courseId = chance.integer()
  const onSuccessMock = vi.fn()
  const participantIds = [chance.guid(), chance.guid()]

  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: ToggleSelectedParticipantsAttendanceMutationVariables
      query: TypedDocumentNode
    }) => {
      const mutationMatches =
        query === toggleSelectedParticipantsAttendance &&
        variables.courseId === courseId &&
        variables.attended === true &&
        variables.ids === participantIds

      return fromValue<{ data: ToggleSelectedParticipantsAttendanceMutation }>({
        data: {
          update_course_participant: {
            affected_rows: mutationMatches ? 1 : 0,
          },
        },
      })
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <BulkAttendanceButton
        courseId={courseId}
        participantIds={participantIds}
        onSuccess={onSuccessMock}
      />
    </Provider>
  )

  await userEvent.click(
    screen.getByRole('button', { name: /mark attendance/i })
  )
  await userEvent.click(screen.getByRole('menuitem', { name: /attended/i }))

  expect(onSuccessMock).toHaveBeenCalledTimes(1)
})

it('marks selected participants as did not attend when option is selected', async () => {
  const courseId = chance.integer()
  const onSuccessMock = vi.fn()
  const participantIds = [chance.guid(), chance.guid()]

  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: ToggleSelectedParticipantsAttendanceMutationVariables
      query: TypedDocumentNode
    }) => {
      const mutationMatches =
        query === toggleSelectedParticipantsAttendance &&
        variables.courseId === courseId &&
        variables.attended === false &&
        variables.ids === participantIds

      return fromValue<{ data: ToggleSelectedParticipantsAttendanceMutation }>({
        data: {
          update_course_participant: {
            affected_rows: mutationMatches ? 1 : 0,
          },
        },
      })
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <BulkAttendanceButton
        courseId={courseId}
        participantIds={participantIds}
        onSuccess={onSuccessMock}
      />
    </Provider>
  )

  await userEvent.click(
    screen.getByRole('button', { name: /mark attendance/i })
  )
  await userEvent.click(
    screen.getByRole('menuitem', { name: /did not attend/i })
  )

  expect(onSuccessMock).toHaveBeenCalledTimes(1)
})
