import React from 'react'

import {
  render,
  providers,
  waitForCalls,
  fireEvent,
  chance,
  screen,
  waitForText,
  userEvent,
} from '@test/index'

import { LoginPage } from './Login'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe('Login', () => {
  it('shows error when email is empty', async () => {
    render(<LoginPage />)

    const email = screen.getByTestId('input-email')
    expect(email).toHaveValue('')
    expect(
      screen.queryByText('Please enter your email')
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForText('Please enter your email')
    await waitForText('Please enter your password')

    expect(providers.auth.login).not.toHaveBeenCalled()
  })

  it('shows error when email is invalid', async () => {
    render(<LoginPage />)

    const email = screen.getByTestId('input-email')

    userEvent.type(email, 'not@valid')
    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForText('Please enter a valid email address', 3000)

    expect(providers.auth.login).not.toHaveBeenCalled()
  })

  // eslint-disable-next-line vitest/expect-expect
  it('attempts login when email is valid', async () => {
    providers.auth.login.mockResolvedValue({ error: { code: 'OnPurpose' } })

    render(<LoginPage />)

    fireEvent.change(screen.getByTestId('input-email'), {
      target: { value: chance.email() },
    })
    fireEvent.change(screen.getByTestId('input-password'), {
      target: { value: 'secret-pass' },
    })
    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForCalls(providers.auth.login, 1)
  })

  it('shows error if password is incorrect', async () => {
    providers.auth.login.mockResolvedValue({
      error: { code: 'NotAuthorizedException' },
    })

    render(<LoginPage />)

    const email = screen.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = screen.getByTestId('input-password')

    fireEvent.change(pass, { target: { value: chance.word() } })
    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForText(
      'Email address or password was incorrect, please try again'
    )
  })

  it('navigates away when login succeeds', async () => {
    providers.auth.login.mockResolvedValue({}) // no error

    render(<LoginPage />)

    const email = screen.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = screen.getByTestId('input-password')
    fireEvent.change(pass, { target: { value: chance.word() } })

    fireEvent.click(screen.getByTestId('login-submit'))
    await waitForCalls(providers.auth.login, 1)

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })
})
