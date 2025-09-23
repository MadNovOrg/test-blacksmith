import { useTranslation } from 'react-i18next'

import { AwsRegions } from '@app/types'

import {
  _render,
  providers,
  waitForCalls,
  fireEvent,
  chance,
  screen,
  waitForText,
  userEvent,
  renderHook,
} from '@test/index'

import { LoginPage } from './Login'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

describe('Login', () => {
  it('shows error when email is empty', async () => {
    _render(<LoginPage />)

    const email = screen.getByTestId('input-email')
    expect(email).toHaveValue('')
    expect(
      screen.queryByText('Please enter your email'),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForText('Please enter your email')
    await waitForText('Please enter your password')

    expect(providers.auth.login).not.toHaveBeenCalled()
  })

  it('shows error when email is invalid', async () => {
    _render(<LoginPage />)

    const email = screen.getByTestId('input-email')

    userEvent.type(email, 'not@valid')
    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForText('Please enter a valid email address', 3000)

    expect(providers.auth.login).not.toHaveBeenCalled()
  })

  // eslint-disable-next-line vitest/expect-expect
  it('attempts login when email is valid', async () => {
    providers.auth.login.mockResolvedValue({ error: { code: 'OnPurpose' } })

    _render(<LoginPage />)

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

    _render(<LoginPage />)

    const email = screen.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = screen.getByTestId('input-password')

    fireEvent.change(pass, { target: { value: chance.word() } })
    fireEvent.click(screen.getByTestId('login-submit'))

    await waitForText(
      'Email address or password was incorrect, please try again',
    )
  })

  it('navigates away when login succeeds', async () => {
    providers.auth.login.mockResolvedValue({})
    _render(<LoginPage />)

    const email = screen.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = screen.getByTestId('input-password')
    fireEvent.change(pass, { target: { value: chance.word() } })

    fireEvent.click(screen.getByTestId('login-submit'))
    await waitForCalls(providers.auth.login, 1)

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })
  it('should redirect to callbackUrl after login', async () => {
    providers.auth.login.mockResolvedValue({})

    _render(
      <LoginPage />,
      {},
      { initialEntries: ['/login?callbackUrl=/dashboard'] },
    )

    const email = screen.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = screen.getByTestId('input-password')
    fireEvent.change(pass, { target: { value: chance.word() } })

    fireEvent.click(screen.getByTestId('login-submit'))
    await waitForCalls(providers.auth.login, 1)

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
      replace: true,
    })
  })
  it('should redirect to callback url if its full url', async () => {
    providers.auth.login.mockResolvedValue({})

    delete (window as { location?: Location }).location
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location = { href: '' } as Location

    _render(
      <LoginPage />,
      {},
      { initialEntries: ['/login?callbackUrl=https://example.com/dashboard'] },
    )

    const email = screen.getByTestId('input-email')
    fireEvent.change(email, { target: { value: chance.email() } })

    const pass = screen.getByTestId('input-password')
    fireEvent.change(pass, { target: { value: chance.word() } })

    fireEvent.click(screen.getByTestId('login-submit'))
    await waitForCalls(providers.auth.login, 1)

    expect(window.location.href).toBe('https://example.com/dashboard')
  })
})

describe('Login ANZ', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })

  it('shows ANZ login wording', async () => {
    _render(<LoginPage />)

    expect(
      screen.queryByText(t('pages.login.login-in-tt-ANZ')),
    ).toBeInTheDocument()
  })
})
