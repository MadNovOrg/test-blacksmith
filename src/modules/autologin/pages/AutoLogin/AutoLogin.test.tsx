import { MockedFunction } from 'vitest'

import { gqlRequest } from '@app/lib/gql-request'
import { RoleName } from '@app/types'

import { chance, render, waitFor, waitForCalls } from '@test/index'

import { AutoLogin } from './AutoLogin'

const mockNavigate = vi.fn()

const mockSearchParams = {
  get: vi.fn((key: string) => {
    const params: Record<string, string> = {
      continue: 'continueURL',
      role: RoleName.USER,
      token: chance.string(),
    }
    return params[key] || null
  }),
}

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}))

vi.mock('@app/lib/gql-request')

const gqlRequestMocked = vi.mocked(gqlRequest)

describe('AutoLogin', () => {
  it('should navigate to the continue URL if the email from the token matches the currently logged-in user', async () => {
    const email = chance.email()
    const mockLogout = vi.fn()

    gqlRequestMocked.mockResolvedValueOnce({
      initAuth: { authChallenge: chance.string(), email },
    })

    render(<AutoLogin />, { auth: { profile: { email }, logout: mockLogout } })

    await waitFor(async () => {
      await waitForCalls(
        gqlRequestMocked as unknown as MockedFunction<
          (...args: unknown[]) => unknown
        >,
      )

      expect(mockLogout).not.toHaveBeenCalledWith()

      expect(mockNavigate).toHaveBeenCalledWith(
        `/continueURL?role=${RoleName.USER}`,
        { replace: true, state: { email } },
      )
    })
  })

  it('should logout if the email from the token does not matches the currently logged-in user', async () => {
    const email = chance.email()
    const mockLogout = vi.fn()

    gqlRequestMocked.mockResolvedValueOnce({
      initAuth: { authChallenge: chance.string(), email },
    })

    render(<AutoLogin />, { auth: { logout: mockLogout } })

    await waitFor(async () => {
      await waitForCalls(
        gqlRequestMocked as unknown as MockedFunction<
          (...args: unknown[]) => unknown
        >,
      )

      expect(mockLogout).toHaveBeenCalledWith(true)

      expect(mockNavigate).toHaveBeenCalledWith(
        `/continueURL?role=${RoleName.USER}`,
        { replace: true, state: { email } },
      )
    })
  })

  it("shouldn't navigate to the continue URL if the 'continue' search params is not present", async () => {
    const email = chance.email()

    mockSearchParams.get = vi.fn((key: string) => {
      const params: Record<string, string> = {
        token: chance.string(),
      }
      return params[key] || null
    })

    gqlRequestMocked.mockResolvedValueOnce({
      initAuth: { authChallenge: chance.string(), email },
    })

    render(<AutoLogin />)

    await waitFor(async () => {
      await waitForCalls(
        gqlRequestMocked as unknown as MockedFunction<
          (...args: unknown[]) => unknown
        >,
      )

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it("navigate to the continue URL without 'role' search params if it's not specified", async () => {
    const email = chance.email()

    mockSearchParams.get = vi.fn((key: string) => {
      const params: Record<string, string> = {
        continue: 'continueURL',
        token: chance.string(),
      }
      return params[key] || null
    })

    gqlRequestMocked.mockResolvedValueOnce({
      initAuth: { authChallenge: chance.string(), email },
    })

    render(<AutoLogin />)

    await waitFor(async () => {
      await waitForCalls(
        gqlRequestMocked as unknown as MockedFunction<
          (...args: unknown[]) => unknown
        >,
      )

      expect(mockNavigate).toHaveBeenCalledWith('/continueURL', {
        replace: true,
        state: { email },
      })
    })
  })
})
