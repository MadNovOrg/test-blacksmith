import { TextField } from '@mui/material'
import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { OrgSelector } from '@app/components/OrgSelector'
import { AuthContextType } from '@app/context/auth/types'
import {
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
} from '@app/generated/graphql'

import {
  chance,
  render,
  renderHook,
  screen,
  userEvent,
  VALID_PHONE_NUMBER,
  waitFor,
} from '@test/index'
import { profile } from '@test/providers'

import { Onboarding } from './Onboarding'

const defaultProfile = profile as NonNullable<AuthContextType['profile']>

const OrgSelectorMock: React.FC<ComponentProps<typeof OrgSelector>> = props => {
  return (
    <TextField
      error={Boolean(props.error)}
      helperText={props.error}
      onChange={() =>
        props.onChange({ id: chance.guid(), name: chance.name() })
      }
      label="Start typing organisation name"
    />
  )
}

vi.mock('@app/components/OrgSelector', () => ({
  OrgSelector: vi.fn(),
}))

const MockedOrgSelector = vi.mocked(OrgSelector)

describe('page: Onboarding', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('validates form data', async () => {
    MockedOrgSelector.mockImplementation(OrgSelectorMock)

    const client = {
      executeMutation: () => never,
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Onboarding />
      </Provider>,
      {},
      { initialEntries: ['/'] },
    )

    await userEvent.clear(
      screen.getByLabelText(t('first-name'), { exact: false }),
    )
    await userEvent.clear(screen.getByLabelText(t('surname'), { exact: false }))
    await userEvent.clear(screen.getByLabelText(t('phone'), { exact: false }))
    await userEvent.clear(screen.getByLabelText(t('dob'), { exact: false }))

    await userEvent.click(
      screen.getByRole('button', { name: /update information/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          t('components.course-enquiry-form.required-first-name'),
          {
            exact: false,
          },
        ),
      ).toBeInTheDocument()
      expect(screen.getByText(/Surname is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Phone is required/i)).toBeInTheDocument()
      expect(
        screen.getByText(/organisation is a required field/i),
      ).toBeInTheDocument()

      expect(
        screen.getByText(t('pages.onboarding.tcs-required')),
      ).toBeInTheDocument()
      expect(
        screen.getByText(t('validation-errors.date-required')),
      ).toBeInTheDocument()
    })
  })

  it('displays an alert if there is an error updating profile', async () => {
    const reloadProfileMock = vi.fn().mockResolvedValue(undefined)

    MockedOrgSelector.mockImplementation(OrgSelectorMock)

    const client = {
      executeMutation: () =>
        fromValue({
          error: new CombinedError({ networkError: Error('network error') }),
        }),
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Onboarding />
      </Provider>,
      { auth: { reloadCurrentProfile: reloadProfileMock } },
      { initialEntries: ['/'] },
    )

    await userEvent.type(
      screen.getByLabelText(t('first-name'), { exact: false }),
      'John',
    )
    await userEvent.type(
      screen.getByLabelText(t('surname'), { exact: false }),
      'Doe',
    )
    await userEvent.type(
      screen.getByLabelText(t('phone'), { exact: false }),
      VALID_PHONE_NUMBER,
    )

    await userEvent.type(
      screen.getByLabelText(t('dob'), { exact: false }),
      '20/03/1990',
    )

    await userEvent.type(
      screen.getByLabelText(/organisation name/i, { exact: false }),
      'Organisation',
    )

    await userEvent.click(
      screen.getByLabelText(t('job-title'), { exact: false }),
    )
    await userEvent.click(screen.getByTestId('job-position-Other'))
    await userEvent.type(screen.getByTestId('other-job-title-input'), 'Admin')

    await userEvent.click(screen.getByLabelText(/I accept/i))

    await userEvent.click(
      screen.getByText(t('pages.onboarding.submit-btn-text')),
    )

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"${t('pages.onboarding.error-saving')}"`,
      )
      expect(reloadProfileMock).not.toHaveBeenCalled()
    })
  })

  it('prefills first and last name from profile', async () => {
    const client = {
      executeMutation: () => never,
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Onboarding />
      </Provider>,
      {},
      { initialEntries: ['/'] },
    )
    await waitFor(() => {
      expect(
        screen.getByLabelText(t('first-name'), { exact: false }),
      ).toHaveValue(defaultProfile.givenName)
      expect(screen.getByLabelText(t('surname'), { exact: false })).toHaveValue(
        defaultProfile.familyName,
      )
    })
  })

  it('updates profile and redirects on success', async () => {
    const phone = VALID_PHONE_NUMBER
    const profileId = chance.guid()

    const reloadProfileMock = vi.fn().mockResolvedValue(undefined)

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
            variables.input.phone,
        )

        return fromValue<{ data: UpdateProfileMutation }>({
          data: {
            updateUserProfile: success,
          },
        })
      },
      executeQuery: () => never,
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
      { initialEntries: ['/onboarding'] },
    )

    await waitFor(() => {
      expect(
        screen.getByLabelText(t('first-name'), { exact: false }),
      ).toHaveValue(defaultProfile.givenName)
      expect(screen.getByLabelText(t('surname'), { exact: false })).toHaveValue(
        defaultProfile.familyName,
      )
    })

    await userEvent.type(
      screen.getByLabelText(t('phone'), { exact: false }),
      phone,
    )
    await userEvent.type(
      screen.getByLabelText(t('dob'), { exact: false }),
      '20/03/1990',
    )

    await userEvent.type(
      screen.getByLabelText(/organisation name/i, { exact: false }),
      'Organisation',
    )

    await userEvent.click(
      screen.getByLabelText(t('job-title'), { exact: false }),
    )
    await userEvent.click(screen.getByTestId(/job-position-Other/i))
    await userEvent.type(screen.getByTestId('other-job-title-input'), 'Admin')

    await userEvent.click(screen.getByLabelText(/I accept/i))

    await userEvent.click(
      screen.getByText(t('pages.onboarding.submit-btn-text')),
    )

    await waitFor(() => {
      expect(screen.getByText(t('home'), { exact: false })).toBeInTheDocument()
      expect(reloadProfileMock).toHaveBeenCalledTimes(1)
    })
  })
})
