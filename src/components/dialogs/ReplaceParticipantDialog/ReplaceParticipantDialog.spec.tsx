import React from 'react'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  GetCourseParticipantOrderQuery,
  ReplaceParticipantError,
  ReplaceParticipantMutation,
  ReplaceParticipantMutationVariables,
} from '@app/generated/graphql'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import {
  Mode,
  Props,
  ReplaceParticipantDialog,
} from './ReplaceParticipantDialog'

describe(ReplaceParticipantDialog.name, () => {
  it('should display participant information', () => {
    const client = {
      executeMutation: () => never,
      executeQuery: () => never,
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog participant={participant} />
      </Provider>,
    )

    expect(screen.getByText(participant.fullName)).toBeInTheDocument()
  })

  it('should call cancel prop when closing dialog', async () => {
    const client = {
      executeMutation: () => never,
      executeQuery: () => never,
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    const onCloseMock = vi.fn()

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog
          participant={participant}
          onClose={onCloseMock}
        />
      </Provider>,
    )

    await userEvent.click(screen.getByText(/close/i))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('should call success prop when participant successfully replaced', async () => {
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
      executeQuery: () => never,
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    const onSuccessMock = vi.fn()

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog
          participant={participant}
          onSuccess={onSuccessMock}
        />
      </Provider>,
    )

    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      'example@example.com',
    )
    await userEvent.type(screen.getByPlaceholderText(/first name/i), 'John')
    await userEvent.type(screen.getByPlaceholderText(/surname/i), 'Doe')

    await userEvent.click(screen.getByTestId('replace-submit'))

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledTimes(1)
    })
  })

  it('should display an alert if there is an error replacing the participant', async () => {
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
      executeQuery: () => never,
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    const onSuccessMock = vi.fn()

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog
          participant={participant}
          onSuccess={onSuccessMock}
        />
      </Provider>,
    )

    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      'example@example.com',
    )
    await userEvent.type(screen.getByPlaceholderText(/first name/i), 'John')
    await userEvent.type(screen.getByPlaceholderText(/surname/i), 'Doe')

    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('replace-submit'))
    })

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledTimes(0)
      expect(
        screen.getByTestId('error-alert').textContent,
      ).toMatchInlineSnapshot(`"There was an error replacing the participant."`)
    })
  })

  it('should require accepting the terms if an org admin is doing the replacement', async () => {
    const client = {
      executeMutation: () => never,
      executeQuery: () => never,
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
      </Provider>,
    )

    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      'example@example.com',
    )
    await userEvent.type(screen.getByPlaceholderText(/first name/i), 'John')
    await userEvent.type(screen.getByPlaceholderText(/surname/i), 'Doe')

    await waitFor(() => {
      expect(screen.getByTestId('replace-submit')).toBeDisabled()
    })

    await userEvent.click(screen.getByTestId('terms-checkbox'))

    await waitFor(() => {
      expect(screen.getByTestId('replace-submit')).toBeEnabled()
    })
  })

  it('should display related orders invoice number', async () => {
    const invoiceNumber = chance.string()

    const client = {
      executeMutation: () => never,
      executeQuery: () =>
        fromValue<{ data: GetCourseParticipantOrderQuery }>({
          data: {
            participant: {
              order: {
                xeroInvoiceNumber: invoiceNumber,
                id: chance.guid(),
              },
            },
          },
        }),
    } as unknown as Client

    const participant: Props['participant'] = {
      id: chance.guid(),
      fullName: chance.name(),
      avatar: chance.url(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog participant={participant} />
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText(/invoice no/i)).toBeInTheDocument()
      expect(screen.getByText(invoiceNumber)).toBeInTheDocument()
    })
  })
})
