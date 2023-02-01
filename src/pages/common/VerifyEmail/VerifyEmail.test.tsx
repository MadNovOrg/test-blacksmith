import { Auth } from 'aws-amplify'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AuthContextType } from '@app/context/auth/types'

import {
  render,
  screen,
  userEvent,
  waitForCalls,
  waitFor,
  waitForText,
} from '@test/index'

import { VerifyEmailPage } from './VerifyEmail'

jest.mock('@app/context/auth', () => ({
  ...jest.requireActual('@app/context/auth'),
  useAuth: jest.fn().mockReturnValue({ loadProfile: jest.fn() }),
}))

jest.mock('aws-amplify', () => ({
  Auth: {
    verifyCurrentUserAttribute: jest.fn().mockResolvedValue({}),
    verifyCurrentUserAttributeSubmit: jest.fn().mockResolvedValue({}),
    currentUserPoolUser: jest.fn(),
  },
}))
const AuthMock = jest.mocked(Auth)
const useAuthMock = jest.mocked(useAuth)

describe('page: VerifyEmailPage', () => {
  const setup = () => {
    return render(
      <Routes>
        <Route path="/" element={<VerifyEmailPage />} />
        <Route path="/profile" element={<div />} />
      </Routes>,
      {},
      { initialEntries: ['/'] }
    )
  }

  it('matchs snapshot', async () => {
    const { container } = setup()
    expect(container).toMatchSnapshot()
  })

  it('sends verification email when verify now is clicked', async () => {
    render(<VerifyEmailPage />)

    expect(screen.queryByTestId('signup-verify-btn')).not.toBeInTheDocument()
    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitForCalls(AuthMock.verifyCurrentUserAttribute)
    expect(AuthMock.verifyCurrentUserAttribute).toHaveBeenCalledWith('email')
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )
  })

  it('does not submit when code is empty', async () => {
    render(<VerifyEmailPage />)

    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )

    expect(screen.queryByTestId('signup-verify-error')).toBeNull()

    userEvent.click(screen.getByTestId('signup-verify-btn'))

    await waitForText('Please enter 6 digit passcode received in email')
  })

  it('shows error when code is invalid', async () => {
    setup()

    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )

    const code = '1234'
    code.split('').forEach((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      userEvent.type(iN, n)
    })

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent(
      'Please enter 6 digit passcode received in email'
    )

    expect(AuthMock.verifyCurrentUserAttributeSubmit).not.toHaveBeenCalled()
  })

  it('calls cognito submit when code is valid', async () => {
    AuthMock.verifyCurrentUserAttributeSubmit.mockResolvedValue('')

    setup()

    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )

    const code = '123456'
    code.split('').forEach((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      userEvent.type(iN, n)
    })

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    await waitForCalls(AuthMock.verifyCurrentUserAttributeSubmit)
    expect(AuthMock.verifyCurrentUserAttributeSubmit).toHaveBeenCalledWith(
      'email',
      code
    )
    await waitFor(() =>
      expect(screen.queryByTestId('btn-goto-login')).toBeInTheDocument()
    )
  })

  it('shows error when code is incorrect', async () => {
    AuthMock.verifyCurrentUserAttributeSubmit.mockRejectedValue({
      code: 'CodeMismatchException',
    })

    setup()

    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )

    const code = '123456'
    code.split('').forEach((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      userEvent.type(iN, n)
    })

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    await waitForCalls(AuthMock.verifyCurrentUserAttributeSubmit)

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent('Verification code is incorrect.')
  })

  it('shows error when code is expired', async () => {
    AuthMock.verifyCurrentUserAttributeSubmit.mockRejectedValue({
      code: 'ExpiredCodeException',
    })

    setup()

    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )

    const code = '123456'
    code.split('').forEach((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      userEvent.type(iN, n)
    })

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    await waitForCalls(AuthMock.verifyCurrentUserAttributeSubmit)

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent(
      'Verification code expired. Please request new code.'
    )
  })

  it('sends new code when resend is pressed', async () => {
    setup()

    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )

    const resendBtn = screen.getByTestId('signup-verify-resend')
    userEvent.click(resendBtn)

    await waitForCalls(AuthMock.verifyCurrentUserAttribute, 2)
    expect(AuthMock.verifyCurrentUserAttribute).toHaveBeenCalledWith('email')
  })

  it('reloads profile before navigating away', async () => {
    AuthMock.verifyCurrentUserAttributeSubmit.mockResolvedValue('')

    const refreshSessionIfPossibleMock = jest.fn().mockResolvedValue('')
    AuthMock.currentUserPoolUser.mockResolvedValue({
      refreshSessionIfPossible: refreshSessionIfPossibleMock,
    })

    const loadProfileMock = jest.fn().mockResolvedValue('')
    useAuthMock.mockReturnValue({
      loadProfile: loadProfileMock,
    } as unknown as AuthContextType)

    setup()

    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )

    const code = '123456'
    code.split('').forEach((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      userEvent.type(iN, n)
    })

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    await waitFor(() =>
      expect(screen.queryByTestId('btn-goto-login')).toBeInTheDocument()
    )

    userEvent.click(screen.getByTestId('btn-goto-login'))

    await waitForCalls(AuthMock.currentUserPoolUser)
    await waitForCalls(refreshSessionIfPossibleMock)
    await waitForCalls(loadProfileMock)
  })
})
