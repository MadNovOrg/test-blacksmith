import { Auth } from 'aws-amplify'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import {
  render,
  screen,
  userEvent,
  waitForCalls,
  waitFor,
  waitForText,
} from '@test/index'

import { VerifyEmailPage } from './VerifyEmail'

jest.mock('aws-amplify', () => ({
  Auth: {
    verifyCurrentUserAttribute: jest.fn().mockResolvedValue({}),
    verifyCurrentUserAttributeSubmit: jest.fn().mockResolvedValue({}),
  },
}))
const AuthMock = jest.mocked(Auth)

describe('page: VerifyEmailPage', () => {
  const setup = () => {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<VerifyEmailPage />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('matchs snapshot', async () => {
    const { container } = setup()
    expect(container).toMatchSnapshot()
  })

  it('sends verification email when verify now is clicked', async () => {
    render(
      <MemoryRouter>
        <VerifyEmailPage />
      </MemoryRouter>
    )

    expect(screen.queryByTestId('signup-verify-btn')).not.toBeInTheDocument()
    userEvent.click(screen.getByTestId('signup-verify-now-btn'))
    await waitForCalls(AuthMock.verifyCurrentUserAttribute)
    expect(AuthMock.verifyCurrentUserAttribute).toBeCalledWith('email')
    await waitFor(() =>
      expect(screen.queryByTestId('signup-verify-btn')).toBeInTheDocument()
    )
  })

  it('does not submit when code is empty', async () => {
    render(
      <MemoryRouter>
        <VerifyEmailPage />
      </MemoryRouter>
    )

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

    expect(AuthMock.verifyCurrentUserAttributeSubmit).not.toBeCalled()
  })

  it('calls cognito submit when code is valid', async () => {
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
    expect(AuthMock.verifyCurrentUserAttributeSubmit).toBeCalledWith(
      'email',
      code
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
    expect(AuthMock.verifyCurrentUserAttribute).toBeCalledWith('email')
  })
})
