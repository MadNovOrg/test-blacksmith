import { Auth } from 'aws-amplify'
import { createSearchParams } from 'react-router-dom'

import { gqlRequest } from '@app/lib/gql-request'

import {
  chance,
  render,
  screen,
  userEvent,
  waitFor,
  waitForCalls,
  waitForText,
} from '@test/index'

import { ForgotPasswordPage } from './ForgotPassword'

vi.mock('@app/lib/gql-request')

const gqlRequestMocked = vi.fn(vi.mocked(gqlRequest))

const AuthMock = vi.fn(vi.mocked(Auth.forgotPassword))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

async function submitForm(email: string) {
  const emailInput = screen.getByLabelText(/email address/i)
  expect(emailInput).toHaveValue('')

  if (email) {
    await userEvent.type(emailInput, email)
  }

  await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

describe('page: ForgotPassword', () => {
  it('renders as expected', async () => {
    render(<ForgotPasswordPage />)

    expect(screen.getByTestId('forgot-pass-submit')).toBeInTheDocument()
    expect(AuthMock).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('does not submit if email is empty', async () => {
    render(<ForgotPasswordPage />)

    await submitForm('')

    await waitForText('Please enter a valid email address')

    expect(AuthMock).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('does not submit if email is invalid format', async () => {
    render(<ForgotPasswordPage />)

    await submitForm('invalid email')

    await waitForText('Please enter a valid email address')

    expect(AuthMock).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('submits when email is valid', async () => {
    render(<ForgotPasswordPage />)

    const email = chance.email()

    await submitForm(email)

    waitFor(async () => {
      await waitForCalls(AuthMock)
      expect(AuthMock).toHaveBeenCalledWith(email)

      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/reset-password',
        search: `?${createSearchParams({ email })}`,
      })
    })
  })

  it('should call backend API for temporary password reset', async () => {
    render(<ForgotPasswordPage />)

    AuthMock.mockImplementation(() => {
      throw new Error()
    })
    gqlRequestMocked.mockResolvedValue({
      resendPassword: true,
    })

    const email = chance.email()

    await submitForm(email)
    waitFor(async () => {
      await waitForCalls(AuthMock)
      await waitForCalls(gqlRequestMocked)
      expect(AuthMock).toHaveBeenCalledWith(email)
      expect(mockNavigate).toHaveBeenCalledWith('/login?passwordResent=true')
    })
  })
})
