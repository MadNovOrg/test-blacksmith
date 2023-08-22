import React from 'react'
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { never, fromValue } from 'wonka'

import {
  Course_Invite_Status_Enum,
  Course_Trainer_Type_Enum,
  SetCourseTrainerStatusMutation,
  SetCourseTrainerStatusMutationVariables,
} from '@app/generated/graphql'
import { SetCourseTrainerStatus } from '@app/queries/courses/set-course-trainer-status'

import { chance, render, screen, userEvent, within } from '@test/index'

import { AcceptDeclineCourse } from '.'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('AcceptDeclineCourse', () => {
  it('renders children if current user has accepted', async () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <AcceptDeclineCourse
          onUpdate={jest.fn()}
          trainer={{
            status: Course_Invite_Status_Enum.Accepted,
            id: chance.guid(),
            type: Course_Trainer_Type_Enum.Leader,
          }}
        />
      </Provider>
    )

    expect(
      screen.queryByRole('button', { name: /accept/i })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: /decline/i })
    ).not.toBeInTheDocument()

    expect(screen.queryByText(/declined/i)).not.toBeInTheDocument()
  })

  it('renders declined status chip if user has declined', async () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <AcceptDeclineCourse
          onUpdate={jest.fn()}
          trainer={{
            status: Course_Invite_Status_Enum.Declined,
            id: chance.guid(),
            type: Course_Trainer_Type_Enum.Leader,
          }}
        />
      </Provider>
    )

    expect(
      screen.queryByRole('button', { name: /accept/i })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: /decline/i })
    ).not.toBeInTheDocument()

    expect(screen.getByText(/declined/i)).toBeInTheDocument()
  })

  it('renders accept and decline buttons if user has not accepted/declined', async () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <AcceptDeclineCourse
          onUpdate={jest.fn()}
          trainer={{
            status: Course_Invite_Status_Enum.Pending,
            id: chance.guid(),
            type: Course_Trainer_Type_Enum.Leader,
          }}
        />
      </Provider>
    )

    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument()

    expect(screen.queryByText(/declined/i)).not.toBeInTheDocument()
  })

  it('calls onUpdate as expected when user ACCEPTS', async () => {
    const onUpdateMock = jest.fn()
    const trainer = {
      status: Course_Invite_Status_Enum.Pending,
      id: chance.guid(),
      type: Course_Trainer_Type_Enum.Leader,
    }

    const client = {
      executeMutation: ({
        query,
        variables,
      }: {
        query: TypedDocumentNode
        variables: SetCourseTrainerStatusMutationVariables
      }) => {
        const mutationMatches =
          query === SetCourseTrainerStatus &&
          variables.status === Course_Invite_Status_Enum.Accepted

        if (mutationMatches) {
          return fromValue<{ data: SetCourseTrainerStatusMutation }>({
            data: {
              update_course_trainer_by_pk: {
                id: trainer.id,
                status: Course_Invite_Status_Enum.Accepted,
              },
            },
          })
        } else {
          return fromValue({
            error: new CombinedError({ networkError: Error('network error') }),
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <AcceptDeclineCourse onUpdate={onUpdateMock} trainer={trainer} />
      </Provider>
    )

    await userEvent.click(screen.getByRole('button', { name: /accept/i }))

    const confirmDialog = screen.getByRole('dialog')

    await userEvent.click(
      within(confirmDialog).getByRole('button', {
        name: /continue to course builder/i,
      })
    )

    expect(onUpdateMock).toHaveBeenCalledTimes(1)
    expect(onUpdateMock).toHaveBeenCalledWith(
      trainer,
      Course_Invite_Status_Enum.Accepted
    )
  })

  it('calls onUpdate as expected when user DECLINES', async () => {
    const onUpdateMock = jest.fn()
    const trainer = {
      status: Course_Invite_Status_Enum.Pending,
      id: chance.guid(),
      type: Course_Trainer_Type_Enum.Leader,
    }

    const client = {
      executeMutation: ({
        query,
        variables,
      }: {
        query: TypedDocumentNode
        variables: SetCourseTrainerStatusMutationVariables
      }) => {
        const mutationMatches =
          query === SetCourseTrainerStatus &&
          variables.status === Course_Invite_Status_Enum.Declined

        if (mutationMatches) {
          return fromValue<{ data: SetCourseTrainerStatusMutation }>({
            data: {
              update_course_trainer_by_pk: {
                id: trainer.id,
                status: Course_Invite_Status_Enum.Declined,
              },
            },
          })
        } else {
          return fromValue({
            error: new CombinedError({ networkError: Error('network error') }),
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <AcceptDeclineCourse onUpdate={onUpdateMock} trainer={trainer} />
      </Provider>
    )

    await userEvent.click(screen.getByRole('button', { name: /Decline/i }))

    const confirmDialog = screen.getByRole('dialog')

    await userEvent.click(
      within(confirmDialog).getByRole('button', {
        name: /decline/i,
      })
    )

    expect(onUpdateMock).toHaveBeenCalledTimes(1)
    expect(onUpdateMock).toHaveBeenCalledWith(
      trainer,
      Course_Invite_Status_Enum.Declined
    )
  })

  it('does not call onUpdate when user cancels', async () => {
    const onUpdateMock = jest.fn()
    const courseId = 10000
    const trainer = {
      status: Course_Invite_Status_Enum.Pending,
      id: chance.guid(),
      type: Course_Trainer_Type_Enum.Leader,
    }

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <AcceptDeclineCourse
          onUpdate={onUpdateMock}
          trainer={trainer}
          courseId={courseId}
        />
      </Provider>
    )

    await userEvent.click(screen.getByRole('button', { name: /Decline/i }))

    const confirmDialog = screen.getByRole('dialog')

    await userEvent.click(
      within(confirmDialog).getByRole('button', {
        name: /cancel/i,
      })
    )

    expect(onUpdateMock).toHaveBeenCalledTimes(0)
  })

  it('handles network error', async () => {
    const onUpdateMock = jest.fn()
    const courseId = 10000
    const trainer = {
      status: Course_Invite_Status_Enum.Pending,
      id: chance.guid(),
      type: Course_Trainer_Type_Enum.Leader,
    }

    const client = {
      executeMutation: () =>
        fromValue({
          error: new CombinedError({ networkError: Error('network error') }),
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <AcceptDeclineCourse
          onUpdate={onUpdateMock}
          trainer={trainer}
          courseId={courseId}
        />
      </Provider>
    )

    await userEvent.click(screen.getByRole('button', { name: /Decline/i }))

    const confirmDialog = screen.getByRole('dialog')

    await userEvent.click(
      within(confirmDialog).getByRole('button', {
        name: /decline/i,
      })
    )

    expect(onUpdateMock).toHaveBeenCalledTimes(0)
  })
})
