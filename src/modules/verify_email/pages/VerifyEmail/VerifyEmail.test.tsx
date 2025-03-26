import { Auth } from 'aws-amplify'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { MockedFunction } from 'vitest'

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

vi.mock('@app/context/auth', async () => ({
  ...((await vi.importActual('@app/context/auth')) as object),
  useAuth: vi.fn().mockReturnValue({ loadProfile: vi.fn() }),
}))

vi.mock('aws-amplify', () => ({
  Auth: {
    verifyCurrentUserAttribute: vi.fn().mockResolvedValue({}),
    verifyCurrentUserAttributeSubmit: vi.fn().mockResolvedValue({}),
    currentUserPoolUser: vi.fn(),
  },
}))
const AuthMock = vi.mocked(Auth)
const useAuthMock = vi.mocked(useAuth)

describe('page: VerifyEmailPage', () => {
  const setup = () => {
    return render(
      <Routes>
        <Route path="/" element={<VerifyEmailPage />} />
        <Route path="/profile" element={<div />} />
      </Routes>,
      {},
      { initialEntries: ['/'] },
    )
  }

  it('sends verification email when verify now is clicked', async () => {
    render(<VerifyEmailPage />)

    expect(screen.queryByTestId('signup-verify-btn')).not.toBeInTheDocument()
    await userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitForCalls(
      AuthMock.verifyCurrentUserAttribute as MockedFunction<
        (...args: unknown[]) => unknown
      >,
    )
    expect(AuthMock.verifyCurrentUserAttribute).toHaveBeenCalledWith('email')
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument(),
    )
  })

  it('does not submit when code is empty', async () => {
    render(<VerifyEmailPage />)

    await userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument(),
    )

    expect(screen.queryByTestId('signup-verify-error')).toBeNull()

    await userEvent.click(screen.getByTestId('signup-verify-btn'))

    await waitForText('Please enter 6 digit passcode received in email')
  })

  it('shows error when code is invalid', async () => {
    setup()

    await userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument(),
    )

    const code = '1234'
    await fillCode(code)

    const submitBtn = screen.getByTestId('signup-verify-btn')
    await userEvent.click(submitBtn)

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent(
      'Please enter 6 digit passcode received in email',
    )

    expect(AuthMock.verifyCurrentUserAttributeSubmit).not.toHaveBeenCalled()
  })

  it('calls cognito submit when code is valid', async () => {
    AuthMock.verifyCurrentUserAttributeSubmit.mockResolvedValue('')

    setup()

    await userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument(),
    )

    const code = '123456'
    await fillCode(code)

    const submitBtn = screen.getByTestId('signup-verify-btn')
    await userEvent.click(submitBtn)

    await waitForCalls(
      AuthMock.verifyCurrentUserAttributeSubmit as MockedFunction<
        (...args: unknown[]) => unknown
      >,
    )
    expect(AuthMock.verifyCurrentUserAttributeSubmit).toHaveBeenCalledWith(
      'email',
      code,
    )
    await waitFor(() =>
      expect(screen.queryByTestId('btn-goto-login')).toBeInTheDocument(),
    )
  })

  it('shows error when code is incorrect', async () => {
    AuthMock.verifyCurrentUserAttributeSubmit.mockRejectedValue({
      code: 'CodeMismatchException',
    })

    setup()

    await userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument(),
    )

    const code = '123456'
    await fillCode(code)

    const submitBtn = screen.getByTestId('signup-verify-btn')
    await userEvent.click(submitBtn)

    await waitForCalls(
      AuthMock.verifyCurrentUserAttributeSubmit as MockedFunction<
        (...args: unknown[]) => unknown
      >,
    )

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent('Verification code is incorrect.')
  })

  it('shows error when code is expired', async () => {
    AuthMock.verifyCurrentUserAttributeSubmit.mockRejectedValue({
      code: 'ExpiredCodeException',
    })

    setup()

    await userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument(),
    )

    const code = '123456'

    await fillCode(code)

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    await waitForCalls(
      AuthMock.verifyCurrentUserAttributeSubmit as MockedFunction<
        (...args: unknown[]) => unknown
      >,
    )

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent(
      'Verification code expired. Please request new code.',
    )
  })

  it('sends new code when resend is pressed', async () => {
    setup()

    await userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument(),
    )

    const resendBtn = screen.getByTestId('signup-verify-resend')
    await userEvent.click(resendBtn)

    await waitForCalls(
      AuthMock.verifyCurrentUserAttribute as MockedFunction<
        (...args: unknown[]) => unknown
      >,
      2,
    )
    expect(AuthMock.verifyCurrentUserAttribute).toHaveBeenCalledWith('email')
  })

  it('reloads profile before navigating away', async () => {
    AuthMock.verifyCurrentUserAttributeSubmit.mockResolvedValue('')

    const refreshSessionIfPossibleMock = vi.fn().mockResolvedValue('')
    AuthMock.currentUserPoolUser.mockResolvedValue({
      refreshSessionIfPossible: refreshSessionIfPossibleMock,
    })

    const loadProfileMock = vi.fn().mockResolvedValue('')
    useAuthMock.mockReturnValue({
      loadProfile: loadProfileMock,
    } as unknown as AuthContextType)

    setup()

    await userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument(),
    )

    const code = '123456'

    await fillCode(code)

    const submitBtn = screen.getByTestId('signup-verify-btn')
    await userEvent.click(submitBtn)

    await waitFor(() =>
      expect(screen.queryByTestId('btn-goto-login')).toBeInTheDocument(),
    )

    await userEvent.click(screen.getByTestId('btn-goto-login'))

    await waitForCalls(
      AuthMock.currentUserPoolUser as MockedFunction<
        (...args: unknown[]) => unknown
      >,
    )
    await waitForCalls(refreshSessionIfPossibleMock)
    await waitForCalls(loadProfileMock)
  })
})

async function fillCode(code: string) {
  await Promise.all(
    code.split('').map((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      return userEvent.type(iN, n)
    }),
  )
}
