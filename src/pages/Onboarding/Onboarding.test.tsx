import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { AuthContextType } from '@app/context/auth/types'
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
import { profile } from '@test/providers'

import { Onboarding } from '.'

const defaultProfile = profile as NonNullable<AuthContextType['profile']>

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

    await userEvent.clear(screen.getByLabelText(/first name/i))
    await userEvent.clear(screen.getByLabelText(/surname/i))
    await userEvent.clear(screen.getByLabelText(/phone/i))
    await userEvent.clear(screen.getByLabelText(/date of birth/i))

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

  it('prefills first and last name from profile', async () => {
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
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue(
        defaultProfile.givenName
      )
      expect(screen.getByLabelText(/surname/i)).toHaveValue(
        defaultProfile.familyName
      )
    })
  })

  it('updates profile and redirects on success', async () => {
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
            variables.input.givenName === defaultProfile.givenName &&
            variables.input.familyName === defaultProfile.familyName &&
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

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue(
        defaultProfile.givenName
      )
      expect(screen.getByLabelText(/surname/i)).toHaveValue(
        defaultProfile.familyName
      )
    })

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
