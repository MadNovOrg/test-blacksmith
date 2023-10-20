import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  ToggleAllParticipantsAttendanceMutation,
  ToggleAllParticipantsAttendanceMutationVariables,
  ToggleSelectedParticipantsAttendanceMutationVariables,
} from '@app/generated/graphql'

import { chance, render, screen, userEvent, within } from '@test/index'

import {
  BulkAttendanceButton,
  toggleAllParticipantsAttendance,
  toggleSelectedParticipantsAttendance,
} from './BulkAttendanceButton'

it('disables button if prop is passed', () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <BulkAttendanceButton courseId={1} disabled />
    </Provider>
  )

  expect(
    screen.getByRole('button', { name: /bulk attendance/i })
  ).toBeDisabled()
})

it('renders correct menu items', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <BulkAttendanceButton courseId={1} />
    </Provider>
  )

  await userEvent.click(
    screen.getByRole('button', { name: /bulk attendance/i })
  )

  expect(screen.getByRole('menuitem', { name: /attended/i }))
  expect(screen.getByRole('menuitem', { name: /did not attend/i }))
})

it('marks all participants as attended when option is selected', async () => {
  const courseId = chance.integer()
  const onSuccessMock = vi.fn()

  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: ToggleAllParticipantsAttendanceMutationVariables
      query: TypedDocumentNode
    }) => {
      const mutationMatches =
        query === toggleAllParticipantsAttendance &&
        variables.courseId === courseId &&
        variables.attended === true

      return fromValue<{ data: ToggleAllParticipantsAttendanceMutation }>({
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
      <BulkAttendanceButton courseId={courseId} onSuccess={onSuccessMock} />
    </Provider>
  )

  await userEvent.click(
    screen.getByRole('button', { name: /bulk attendance/i })
  )
  await userEvent.click(screen.getByRole('menuitem', { name: /attended/i }))

  const dialog = screen.getByRole('dialog')

  expect(dialog).toBeInTheDocument()

  await userEvent.click(
    within(dialog).getByRole('button', { name: /confirm/i })
  )

  expect(onSuccessMock).toHaveBeenCalledTimes(1)
})

it('marks all participants as did not attend when option is selected', async () => {
  const courseId = chance.integer()
  const onSuccessMock = vi.fn()

  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: ToggleAllParticipantsAttendanceMutationVariables
      query: TypedDocumentNode
    }) => {
      const mutationMatches =
        query === toggleAllParticipantsAttendance &&
        variables.courseId === courseId &&
        variables.attended === false

      return fromValue<{ data: ToggleAllParticipantsAttendanceMutation }>({
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
      <BulkAttendanceButton courseId={courseId} onSuccess={onSuccessMock} />
    </Provider>
  )

  await userEvent.click(
    screen.getByRole('button', { name: /bulk attendance/i })
  )
  await userEvent.click(
    screen.getByRole('menuitem', { name: /did not attend/i })
  )

  const dialog = screen.getByRole('dialog')

  expect(dialog).toBeInTheDocument()

  await userEvent.click(
    within(dialog).getByRole('button', { name: /confirm/i })
  )

  expect(onSuccessMock).toHaveBeenCalledTimes(1)
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

      return fromValue<{ data: ToggleAllParticipantsAttendanceMutation }>({
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
    screen.getByRole('button', { name: /bulk attendance/i })
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

      return fromValue<{ data: ToggleAllParticipantsAttendanceMutation }>({
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
    screen.getByRole('button', { name: /bulk attendance/i })
  )
  await userEvent.click(
    screen.getByRole('menuitem', { name: /did not attend/i })
  )

  expect(onSuccessMock).toHaveBeenCalledTimes(1)
})
