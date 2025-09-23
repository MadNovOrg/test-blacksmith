import React from 'react'

import { _render, screen, userEvent, waitForText } from '@test/index'

import { ResetPasswordPage } from './ResetPassword'

describe('page: ResetPasswordPage', () => {
  // eslint-disable-next-line vitest/expect-expect
  it('error when both password fields are empty', async () => {
    _render(<ResetPasswordPage />)

    const code = '123456'
    await fillCode(code)
    await userEvent.click(screen.getByTestId('reset-password'))

    await waitForText('Please enter a new password')
    await waitForText('Please re-enter the new password')
  })

  it('error when OTP is empty', async () => {
    _render(<ResetPasswordPage />)
    const passwordInput = screen.getByTestId('first-passsword-input')
    const confirmPasswordInput = screen.getByTestId('second-passsword-input')
    const password = 'Test1234!'
    await userEvent.type(passwordInput, password)
    await userEvent.type(confirmPasswordInput, password)
    await userEvent.click(screen.getByTestId('reset-password'))

    await waitForText('Please enter a new password')
    await waitForText('Please re-enter the new password')
    const error = await screen.findByTestId('reset-password-passcode-error')
    expect(error).toHaveTextContent(
      'Please enter 6 digit passcode received in email',
    )
  })

  it('should correctly display the Password Hint Message', () => {
    _render(<ResetPasswordPage />)

    expect(screen.getByTestId('password-hint-message')).toBeInTheDocument()
  })
})

async function fillCode(code: string) {
  await Promise.all(
    code.split('').map((n, i) => {
      const iN = screen.getByTestId(`passcode-${i}`)
      return userEvent.type(iN, n)
    }),
  )
}
