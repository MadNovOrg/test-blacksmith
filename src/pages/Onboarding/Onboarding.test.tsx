import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
} from '@app/generated/graphql'

import {
  chance,
  render,
  screen,
  userEvent,
  VALID_PHONE_NUMBER,
  waitFor,
} from '@test/index'

import { Onboarding } from '.'

describe('page: Onboarding', () => {
  it('validates form data', async () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Onboarding />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    await userEvent.click(screen.getByText(/update/i))

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/surname is required/i)).toBeInTheDocument()
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
      expect(
        screen.getByText(/accepting our T&C is required/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/please enter your date of birth/i)
      ).toBeInTheDocument()
    })
  })

  it('displays an alert if there is an error updating profile', async () => {
    const reloadProfileMock = jest.fn().mockResolvedValue(undefined)

    const client = {
      executeMutation: () =>
        fromValue({
          error: new CombinedError({ networkError: Error('network error') }),
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Onboarding />
      </Provider>,
      { auth: { reloadCurrentProfile: reloadProfileMock } },
      { initialEntries: ['/'] }
    )

    await userEvent.type(screen.getByLabelText(/first name/i), 'John')
    await userEvent.type(screen.getByLabelText(/surname/i), 'Doe')
    await userEvent.type(screen.getByLabelText(/phone/i), VALID_PHONE_NUMBER)
    await userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')

    await userEvent.click(screen.getByLabelText(/i accept/i))

    await userEvent.click(screen.getByText(/update/i))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"We're having issue saving your personal information."`
      )
      expect(reloadProfileMock).not.toHaveBeenCalled()
    })
  })

  it('updates profile and redirects on success', async () => {
    const firstName = 'John'
    const lastName = 'Doe'
    const phone = VALID_PHONE_NUMBER
    const profileId = chance.guid()

    const reloadProfileMock = jest.fn().mockResolvedValue(undefined)

    const client = {
      executeMutation: ({
        variables,
      }: {
        variables: UpdateProfileMutationVariables
      }) => {
        const success = Boolean(
          variables.input.profileId === profileId &&
            variables.input.givenName === firstName &&
            variables.input.familyName === lastName &&
            variables.input.phone
        )

        return fromValue<{ data: UpdateProfileMutation }>({
          data: {
            updateUserProfile: success,
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/" element={<p>home</p>} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </Provider>,
      {
        auth: {
          reloadCurrentProfile: reloadProfileMock,
          profile: { id: profileId },
        },
      },
      { initialEntries: ['/onboarding'] }
    )

    await userEvent.type(screen.getByLabelText(/first name/i), firstName)
    await userEvent.type(screen.getByLabelText(/surname/i), lastName)
    await userEvent.type(screen.getByLabelText(/phone/i), phone)
    await userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')
    await userEvent.click(screen.getByLabelText(/i accept/i))

    await userEvent.click(screen.getByText(/update/i))

    await waitFor(() => {
      expect(screen.getByText(/home/i)).toBeInTheDocument()
      expect(reloadProfileMock).toHaveBeenCalledTimes(1)
    })
  })
})
