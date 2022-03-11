import React from 'react'
import { Auth } from 'aws-amplify'
import { MemoryRouter, createSearchParams } from 'react-router-dom'

import { ForgotPasswordPage } from './ForgotPassword'

import {
  screen,
  render,
  userEvent,
  waitForText,
  chance,
  waitForCalls,
} from '@test/index'

const AuthMock = jest.mocked(Auth)

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('page: ForgotPassword', () => {
  it('renders as expected', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('forgot-pass-submit')).toBeInTheDocument()
    expect(Auth.forgotPassword).not.toBeCalled()
    expect(mockNavigate).not.toBeCalled()
  })

  it('does not submit if email is empty', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByTestId('forgot-email-input')
    expect(emailInput).toHaveValue('')

    userEvent.click(screen.getByTestId('forgot-pass-submit'))

    await waitForText('Please enter your email')

    expect(Auth.forgotPassword).not.toBeCalled()
    expect(mockNavigate).not.toBeCalled()
  })

  it('does not submit if email is invalid', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByTestId('forgot-email-input')
    expect(emailInput).toHaveValue('')

    userEvent.type(emailInput, 'not a valid email')
    userEvent.click(screen.getByTestId('forgot-pass-submit'))

    await waitForText('Please enter a valid email address')

    expect(Auth.forgotPassword).not.toBeCalled()
    expect(mockNavigate).not.toBeCalled()
  })

  it('submits when email is valid', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByTestId('forgot-email-input')
    expect(emailInput).toHaveValue('')

    const email = chance.email()
    userEvent.type(emailInput, email)
    userEvent.click(screen.getByTestId('forgot-pass-submit'))

    await waitForCalls(AuthMock.forgotPassword)
    expect(AuthMock.forgotPassword).toBeCalledWith(email)

    expect(mockNavigate).toBeCalledWith({
      pathname: '/reset-password',
      search: `?${createSearchParams({ email })}`,
    })
  })
})
