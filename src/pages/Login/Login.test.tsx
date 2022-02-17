import React from 'react'

import { LoginPage } from './Login'

import { render, providers, waitForCalls, fireEvent, chance } from '@test/index'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Login', () => {
  it('renders as expected', async () => {
    const r = render(<LoginPage />)

    expect(r.getByTestId('LoginForm')).toBeInTheDocument()
    expect(r.queryByTestId('LoginLoader')).not.toBeInTheDocument()

    expect(r.getByTestId('input-email')).toBeInTheDocument()
    expect(r.getByText('Email Address')).toBeInTheDocument()
    expect(r.queryByTestId('input-email-error')).not.toBeInTheDocument()

    expect(r.getByText('Password')).toBeInTheDocument()
    expect(r.getByTestId('input-password')).toBeInTheDocument()
    expect(r.queryByTestId('input-password-error')).not.toBeInTheDocument()

    expect(r.getByTestId('LoginSubmit')).toBeEnabled()
  })

  it('shows error when email is empty', async () => {
    const r = render(<LoginPage />)

    const email = r.getByTestId('input-email')
    expect(email).toHaveValue('')
    expect(r.queryByTestId('input-email-error')).not.toBeInTheDocument()

    fireEvent.click(r.getByTestId('LoginSubmit'))
    const emailError = await r.findByTestId('input-email-error')
    expect(emailError).toHaveTextContent('Please enter a valid email address')

    expect(r.queryByTestId('input-password-error')).not.toBeInTheDocument()

    expect(providers.auth.login).not.toBeCalled()
  })

  it('shows error when email is invalid', async () => {
    const r = render(<LoginPage />)

    const email = r.getByTestId('input-email')
    expect(email).toHaveValue('')
    expect(r.queryByTestId('input-email-error')).not.toBeInTheDocument()

    fireEvent.change(email, { target: { value: 'not@valid' } })
    fireEvent.click(r.getByTestId('LoginSubmit'))
    const emailError = await r.findByTestId('input-email-error')
    expect(emailError).toHaveTextContent('Please enter a valid email address')

    expect(r.queryByTestId('input-password-error')).not.toBeInTheDocument()

    expect(providers.auth.login).not.toBeCalled()
  })

  it('attempts login when email is valid', async () => {
    providers.auth.login.mockResolvedValue({ error: { code: 'OnPurpose' } })

    const r = render(<LoginPage />)

    const email = r.getByTestId('input-email')
    expect(email).toHaveValue('')
    expect(r.queryByTestId('input-email-error')).not.toBeInTheDocument()

    fireEvent.change(email, { target: { value: chance.email() } })
    fireEvent.click(r.getByTestId('LoginSubmit'))

    await r.findByTestId('LoginLoader') // shows loading

    await waitForCalls(providers.auth.login, 1)
    expect(r.queryByTestId('input-email-error')).not.toBeInTheDocument()
    expect(r.queryByTestId('input-password-error')).toBeInTheDocument()
  })

  it('shows error if password is empty', async () => {
    providers.auth.login.mockResolvedValue({
      error: { code: 'InvalidParameterException' },
    })

    const r = render(<LoginPage />)

    const email = r.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = r.getByTestId('input-password')
    expect(pass).toHaveValue('')

    fireEvent.click(r.getByTestId('LoginSubmit'))
    await waitForCalls(providers.auth.login, 1)

    expect(r.queryByTestId('input-email-error')).not.toBeInTheDocument()
    const passError = await r.findByTestId('input-password-error')
    expect(passError).toHaveTextContent('Please enter a password')
  })

  it('shows error if password is incorrect', async () => {
    providers.auth.login.mockResolvedValue({
      error: { code: 'NotAuthorizedException' },
    })

    const r = render(<LoginPage />)

    const email = r.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = r.getByTestId('input-password')
    expect(pass).toHaveValue('')

    fireEvent.change(pass, { target: { value: chance.word() } })
    fireEvent.click(r.getByTestId('LoginSubmit'))
    await waitForCalls(providers.auth.login, 1)

    expect(r.queryByTestId('input-email-error')).not.toBeInTheDocument()
    const passError = await r.findByTestId('input-password-error')
    expect(passError).toHaveTextContent(
      'Email address or password was incorrect, please try again'
    )
  })

  it('navigates away when login succeeds', async () => {
    providers.auth.login.mockResolvedValue({}) // no error

    const r = render(<LoginPage />)

    const email = r.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = r.getByTestId('input-password')
    fireEvent.change(pass, { target: { value: chance.word() } })

    fireEvent.click(r.getByTestId('LoginSubmit'))
    await waitForCalls(providers.auth.login, 1)

    expect(r.queryByTestId('input-email-error')).not.toBeInTheDocument()
    expect(r.queryByTestId('input-pass-error')).not.toBeInTheDocument()

    expect(mockNavigate).toBeCalledWith('/', { replace: true })
  })
})
