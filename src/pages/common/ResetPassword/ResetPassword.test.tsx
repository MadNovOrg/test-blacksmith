import React from 'react'

import { render, screen, userEvent, waitForText } from '@test/index'

import { ResetPasswordPage } from './ResetPassword'

describe('page: ResetPasswordPage', () => {
  it('error when both password fields are empty', async () => {
    render(<ResetPasswordPage />)

    const code = '123456'
    await fillCode(code)
    await userEvent.click(screen.getByTestId('reset-password'))

    await waitForText('Please enter a new password')
    await waitForText('Please re-enter the new password')
  })

  it('error when OTP is empty', async () => {
    render(<ResetPasswordPage />)
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
      'Please enter 6 digit passcode received in email'
    )
  })
})
async function fillCode(code: string) {
  await Promise.all(
    code.split('').map((n, i) => {
      const iN = screen.getByTestId(`passcode-${i}`)
      return userEvent.type(iN, n)
    })
  )
}
