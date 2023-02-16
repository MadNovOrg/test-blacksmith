import { Auth } from 'aws-amplify'
import React from 'react'
import { createSearchParams } from 'react-router-dom'

import { gqlRequest } from '@app/lib/gql-request'

import {
  chance,
  render,
  screen,
  userEvent,
  waitForCalls,
  waitForText,
} from '@test/index'

import { ForgotPasswordPage } from './ForgotPassword'

jest.mock('@app/lib/gql-request')

const gqlRequestMocked = jest.mocked(gqlRequest)

const AuthMock = jest.mocked(Auth)

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('page: ForgotPassword', () => {
  it('renders as expected', async () => {
    render(<ForgotPasswordPage />)

    expect(screen.getByTestId('forgot-pass-submit')).toBeInTheDocument()
    expect(Auth.forgotPassword).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('does not submit if email is empty', async () => {
    render(<ForgotPasswordPage />)

    const emailInput = screen.getByTestId('forgot-email-input')
    expect(emailInput).toHaveValue('')

    await userEvent.click(screen.getByTestId('forgot-pass-submit'))

    await waitForText('Please enter your email')

    expect(Auth.forgotPassword).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('does not submit if email is invalid', async () => {
    render(<ForgotPasswordPage />)

    const emailInput = screen.getByTestId('forgot-email-input')
    expect(emailInput).toHaveValue('')

    await userEvent.type(emailInput, 'not a valid email')
    await userEvent.click(screen.getByTestId('forgot-pass-submit'))

    await waitForText('Please enter a valid email address')

    expect(Auth.forgotPassword).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('submits when email is valid', async () => {
    render(<ForgotPasswordPage />)

    const emailInput = screen.getByTestId('forgot-email-input')
    expect(emailInput).toHaveValue('')

    const email = chance.email()
    await userEvent.type(emailInput, email)
    await userEvent.click(screen.getByTestId('forgot-pass-submit'))

    await waitForCalls(AuthMock.forgotPassword)
    expect(AuthMock.forgotPassword).toHaveBeenCalledWith(email)

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/reset-password',
      search: `?${createSearchParams({ email })}`,
    })
  })

  it('should call backend API for temporary password reset', async () => {
    render(<ForgotPasswordPage />)

    AuthMock.forgotPassword.mockImplementation(() => {
      throw new Error()
    })
    gqlRequestMocked.mockResolvedValue({
      resendPassword: true,
    })

    const emailInput = screen.getByTestId('forgot-email-input')
    const email = chance.email()
    await userEvent.type(emailInput, email)
    await userEvent.click(screen.getByTestId('forgot-pass-submit'))

    await waitForCalls(AuthMock.forgotPassword)
    await waitForCalls(gqlRequestMocked)
    expect(AuthMock.forgotPassword).toHaveBeenCalledWith(email)

    expect(mockNavigate).toHaveBeenCalledWith('/login?passwordResent=true')
  })
})
