import React from 'react'
import { Auth } from 'aws-amplify'

import { SignUpVerify } from './Verify'

import { render, screen, chance, userEvent, waitForCalls } from '@test/index'

const defaultProps = {
  username: chance.email(),
  onVerified: jest.fn(),
}

const AuthMock = jest.mocked(Auth)

describe('page: SignUpVerify', () => {
  it('renders as expected', async () => {
    const props = { ...defaultProps }
    render(<SignUpVerify {...props} />)
    expect(screen.getByTestId('signup-verify-btn')).toBeInTheDocument()
  })

  it('does not submit when code is empty', async () => {
    const props = { ...defaultProps }
    render(<SignUpVerify {...props} />)

    const submitBtn = screen.getByTestId('signup-verify-btn')
    expect(screen.queryByTestId('signup-verify-error')).toBeNull()

    userEvent.click(submitBtn)

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent('Verification code is required')
    expect(AuthMock.confirmSignUp).not.toBeCalled()
  })

  it('shows error when code is invalid', async () => {
    const props = { ...defaultProps }
    render(<SignUpVerify {...props} />)

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

    expect(AuthMock.confirmSignUp).not.toBeCalled()
    expect(props.onVerified).not.toBeCalled()
  })

  it('calls confirmSignUp when code is valid', async () => {
    const props = { ...defaultProps }
    render(<SignUpVerify {...props} />)

    const code = '123456'
    code.split('').forEach((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      userEvent.type(iN, n)
    })

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    await waitForCalls(props.onVerified)

    expect(AuthMock.confirmSignUp).toBeCalledWith(props.username, code)
    expect(props.onVerified).toBeCalledWith()
  })

  it('shows error when code is incorrect', async () => {
    AuthMock.confirmSignUp.mockRejectedValue({
      code: 'CodeMismatchException',
    })

    const props = { ...defaultProps }
    render(<SignUpVerify {...props} />)

    const code = '123456'
    code.split('').forEach((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      userEvent.type(iN, n)
    })

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    await waitForCalls(AuthMock.confirmSignUp)

    expect(AuthMock.confirmSignUp).toBeCalledWith(props.username, code)
    expect(props.onVerified).not.toBeCalled()

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent('Verification code is incorrect.')
  })

  it('shows error when code is expired', async () => {
    AuthMock.confirmSignUp.mockRejectedValue({
      code: 'ExpiredCodeException',
    })

    const props = { ...defaultProps }
    render(<SignUpVerify {...props} />)

    const code = '123456'
    code.split('').forEach((n, i) => {
      const iN = screen.getByTestId(`signup-verify-code-${i}`)
      userEvent.type(iN, n)
    })

    const submitBtn = screen.getByTestId('signup-verify-btn')
    userEvent.click(submitBtn)

    await waitForCalls(AuthMock.confirmSignUp)

    expect(AuthMock.confirmSignUp).toBeCalledWith(props.username, code)
    expect(props.onVerified).not.toBeCalled()

    const error = await screen.findByTestId('signup-verify-error')
    expect(error).toHaveTextContent(
      'Verification code expired. Please request new code.'
    )
  })

  it('sends new code when resend is pressed', async () => {
    AuthMock.confirmSignUp.mockRejectedValue({
      code: 'ExpiredCodeException',
    })

    const props = { ...defaultProps }
    render(<SignUpVerify {...props} />)

    const resendBtn = screen.getByTestId('signup-verify-resend')
    userEvent.click(resendBtn)

    await waitForCalls(AuthMock.resendSignUp)

    expect(AuthMock.resendSignUp).toBeCalledWith(props.username)
  })
})
