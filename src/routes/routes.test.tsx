import { Navigate } from 'react-router-dom'

import { RoleName } from '@app/types'

import { chance, _render } from '@test/index'

import { RedirectToLogin } from '.'

const mockUseLocation = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  Navigate: vi.fn(() => null),
  useLocation: () => mockUseLocation(),
}))

describe('RedirectToLogin', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to /login with undefined state if loggedOut is true and autoLoggedOut is false', () => {
    mockUseLocation.mockReturnValue({
      pathname: chance.url(),
      search: '',
      state: null,
    })

    _render(<RedirectToLogin />, {
      auth: { loggedOut: true, autoLoggedOut: false },
    })

    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        replace: true,
        to: 'login',
        state: undefined,
      }),
      undefined,
    )
  })

  it('should redirect to /login with the correct role in query params', () => {
    const mockedEmail = chance.email()
    const mockedPathname = chance.url()

    Object.defineProperty(window, 'location', {
      value: {
        search: `?role=${RoleName.USER}`,
      },
    })

    mockUseLocation.mockReturnValue({
      pathname: mockedPathname,
      search: `?${RoleName.USER}`,
      state: { email: mockedEmail },
    })

    _render(<RedirectToLogin />)

    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        replace: true,
        to: `login?role=${RoleName.USER}`,
        state: {
          email: mockedEmail,
          from: {
            fromLogin: true,
            pathname: mockedPathname,
            search: `?${RoleName.USER}`,
          },
        },
      }),
      undefined,
    )
  })

  it('should redirect to /login without a role if an invalid role is provided', () => {
    const mockedEmail = chance.email()
    const mockedPathname = chance.url()

    Object.defineProperty(window, 'location', {
      value: {
        search: `?role=INVALID_ROLE`,
      },
    })

    mockUseLocation.mockReturnValue({
      pathname: mockedPathname,
      search: '',
      state: { email: mockedEmail },
    })

    _render(<RedirectToLogin />)

    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        replace: true,
        to: 'login',
        state: {
          email: mockedEmail,
          from: {
            fromLogin: true,
            pathname: mockedPathname,
            search: '',
          },
        },
      }),
      undefined,
    )
  })
})
