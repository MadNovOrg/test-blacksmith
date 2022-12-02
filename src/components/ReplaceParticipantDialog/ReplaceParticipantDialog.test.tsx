import React from 'react'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  ReplaceParticipantError,
  ReplaceParticipantMutation,
  ReplaceParticipantMutationVariables,
} from '@app/generated/graphql'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { Mode, Props, ReplaceParticipantDialog } from '.'

describe('component: ReplaceParticipantDialog', () => {
  it('displays participant information', () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog participant={participant} />
      </Provider>
    )

    expect(screen.getByText(participant.fullName)).toBeInTheDocument()
  })

  it('validates email field', async () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog participant={participant} />
      </Provider>
    )

    userEvent.type(screen.getByPlaceholderText(/email/i), 'invalid email')

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument()
    })
  })

  it('calls cancel prop when closing dialog', () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    const onCloseMock = jest.fn()

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog
          participant={participant}
          onClose={onCloseMock}
        />
      </Provider>
    )

    userEvent.click(screen.getByText(/never mind/i))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('calls success prop when participant successfully replaced', async () => {
    const inviteeEmail = 'example@example.com'
    const inviteeFirstName = 'John'
    const inviteeSurname = 'Doe'

    const client = {
      executeMutation: ({
        variables,
      }: {
        variables: ReplaceParticipantMutationVariables
      }) => {
        const success =
          variables.input.inviteeEmail === inviteeEmail &&
          variables.input.inviteeFirstName === inviteeFirstName &&
          variables.input.inviteeLastName === inviteeSurname

        return fromValue<{ data: ReplaceParticipantMutation }>({
          data: {
            replaceParticipant: {
              success,
            },
          },
        })
      },
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    const onSuccessMock = jest.fn()

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog
          participant={participant}
          onSuccess={onSuccessMock}
        />
      </Provider>
    )

    userEvent.type(screen.getByPlaceholderText(/first name/i), 'John')
    userEvent.type(screen.getByPlaceholderText(/surname/i), 'Doe')
    userEvent.type(screen.getByPlaceholderText(/email/i), 'example@example.com')

    await waitFor(() => {
      userEvent.click(screen.getByText(/replace attendee/i))
    })

    expect(onSuccessMock).toHaveBeenCalledTimes(1)
  })

  it('displays an alert if there is an error replacing the participant', async () => {
    const client = {
      executeMutation: () =>
        fromValue<{ data: ReplaceParticipantMutation }>({
          data: {
            replaceParticipant: {
              success: false,
              error: ReplaceParticipantError.GenericError,
            },
          },
        }),
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    const onSuccessMock = jest.fn()

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog
          participant={participant}
          onSuccess={onSuccessMock}
        />
      </Provider>
    )

    userEvent.type(screen.getByPlaceholderText(/first name/i), 'John')
    userEvent.type(screen.getByPlaceholderText(/surname/i), 'Doe')
    userEvent.type(screen.getByPlaceholderText(/email/i), 'example@example.com')

    await waitFor(() => {
      userEvent.click(screen.getByText(/replace attendee/i))
    })

    expect(onSuccessMock).toHaveBeenCalledTimes(0)
    expect(screen.getByTestId('error-alert').textContent).toMatchInlineSnapshot(
      `"There was an error replacing the participant."`
    )
  })

  it('requires accepting the terms if an org admin is doing the replacement', async () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog
          participant={participant}
          mode={Mode.ORG_ADMIN}
        />
      </Provider>
    )

    userEvent.type(screen.getByPlaceholderText(/first name/i), 'John')
    userEvent.type(screen.getByPlaceholderText(/surname/i), 'Doe')
    userEvent.type(screen.getByPlaceholderText(/email/i), 'example@example.com')

    await waitFor(() => {
      expect(screen.getByText(/replace attendee/i)).toBeDisabled()
    })

    userEvent.click(screen.getByTestId('terms-checkbox'))

    await waitFor(() => {
      expect(screen.getByText(/replace attendee/i)).toBeEnabled()
    })
  })
})
