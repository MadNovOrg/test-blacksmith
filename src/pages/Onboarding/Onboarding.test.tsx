import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  OnboardUserMutation,
  OnboardUserMutationVariables,
} from '@app/generated/graphql'

import {
  chance,
  render,
  screen,
  userEvent,
  waitFor,
  VALID_PHONE_NUMBER,
} from '@test/index'

import { Onboarding } from '.'

describe('page: Onboarding', () => {
  it('validates form data', async () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <MemoryRouter initialEntries={['/']}>
          <Onboarding />
        </MemoryRouter>
      </Provider>
    )

    userEvent.click(screen.getByText(/update/i))

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
        <MemoryRouter initialEntries={['/']}>
          <Onboarding />
        </MemoryRouter>
      </Provider>,
      { auth: { reloadCurrentProfile: reloadProfileMock } }
    )

    userEvent.type(screen.getByLabelText(/first name/i), 'John')
    userEvent.type(screen.getByLabelText(/surname/i), 'Doe')
    userEvent.type(screen.getByLabelText(/phone/i), VALID_PHONE_NUMBER)
    userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')

    userEvent.click(screen.getByLabelText(/i accept/i))

    userEvent.click(screen.getByText(/update/i))

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
        variables: OnboardUserMutationVariables
      }) => {
        const success =
          variables.id === profileId &&
          variables.input.givenName === firstName &&
          variables.input.familyName === lastName &&
          variables.input.phone

        return fromValue<{ data: OnboardUserMutation }>({
          data: {
            update_profile_by_pk: success ? { id: profileId } : null,
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <MemoryRouter initialEntries={['/onboarding']}>
          <Routes>
            <Route path="/" element={<p>home</p>} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
      {
        auth: {
          reloadCurrentProfile: reloadProfileMock,
          profile: { id: profileId },
        },
      }
    )

    userEvent.type(screen.getByLabelText(/first name/i), firstName)
    userEvent.type(screen.getByLabelText(/surname/i), lastName)
    userEvent.type(screen.getByLabelText(/phone/i), phone)
    userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')
    userEvent.click(screen.getByLabelText(/i accept/i))

    userEvent.click(screen.getByText(/update/i))

    await waitFor(() => {
      expect(screen.getByText(/home/i)).toBeInTheDocument()
      expect(reloadProfileMock).toHaveBeenCalledTimes(1)
    })
  })
})
