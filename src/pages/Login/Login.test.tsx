import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { LoginPage } from './Login'

import {
  render,
  providers,
  waitForCalls,
  fireEvent,
  chance,
  screen,
  waitForText,
} from '@test/index'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Login', () => {
  it('matches snapshot', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(container).toMatchSnapshot()
  })

  it('shows error when email is empty', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const email = screen.getByTestId('input-email')
    expect(email).toHaveValue('')
    expect(
      screen.queryByText('Please enter your email')
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForText('Please enter your email')
    await waitForText('Please enter your password')

    expect(providers.auth.login).not.toBeCalled()
  })

  it('shows error when email is invalid', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const email = screen.getByTestId('input-email')

    fireEvent.change(email, { target: { value: 'not@valid' } })
    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForText('Please enter a valid email address')

    expect(providers.auth.login).not.toBeCalled()
  })

  it('attempts login when email is valid', async () => {
    providers.auth.login.mockResolvedValue({ error: { code: 'OnPurpose' } })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

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

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

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

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const email = screen.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = screen.getByTestId('input-password')
    fireEvent.change(pass, { target: { value: chance.word() } })

    fireEvent.click(screen.getByTestId('login-submit'))
    await waitForCalls(providers.auth.login, 1)

    expect(mockNavigate).toBeCalledWith('/', { replace: true })
  })
})
