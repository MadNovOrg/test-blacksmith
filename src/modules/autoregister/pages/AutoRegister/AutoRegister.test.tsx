import { DocumentNode } from 'graphql'
import { getI18n } from 'react-i18next'
import { Routes, Route } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { useAuth } from '@app/context/auth'
import { AuthContextType } from '@app/context/auth/types'
import { GetOrgByIdQuery } from '@app/generated/graphql'
import { GET_ORG_BY_ID } from '@app/modules/autoregister/queries/get-org-by-id'

import { render, screen, chance } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { AutoRegisterPage } from './AutoRegister'

vi.mock('@app/context/auth', async () => ({
  ...((await vi.importActual('@app/context/auth')) as object),
  useAuth: vi.fn().mockReturnValue({
    loadProfile: vi.fn(),
    acl: {
      isAustralia: vi.fn().mockReturnValue(false),
      isUK: vi.fn().mockReturnValue(true),
    },
  }),
}))

const useAuthMock = vi.mocked(useAuth)
const { t } = getI18n()

function createFetchingClient() {
  return {
    executeQuery: () => never,
  } as unknown as Client
}

const orgName = chance.name()

describe('page: AutoRegister', () => {
  it('renders component correctly', () => {
    const loadProfileMock = vi.fn().mockResolvedValue(null)

    useAuthMock.mockReturnValue({
      loadProfile: loadProfileMock,
      acl: {
        isAustralia: vi.fn().mockReturnValue(false),
        isUK: vi.fn().mockReturnValue(true),
      },
    } as unknown as AuthContextType)

    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/auto-register" element={<AutoRegisterPage />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/auto-register?token=${chance.guid()}`] },
    )

    const pageTitle = t(`common.create-free-account`)
    const pageTitleSelector = screen.getByTestId('page-title')

    expect(pageTitleSelector).toBeInTheDocument()
    expect(pageTitleSelector).toHaveTextContent(pageTitle)
  })

  it('displays the *Auto-Register* form in following conditions: no user profile, invitation token available, no error from GET_ORG_BY_ID query', () => {
    const loadProfileMock = vi.fn().mockResolvedValue(buildProfile())

    useAuthMock.mockReturnValue({
      loadProfile: loadProfileMock,
      acl: {
        isAustralia: vi.fn().mockReturnValue(false),
        isUK: vi.fn().mockReturnValue(true),
      },
    } as unknown as AuthContextType)

    // mock GET_ORG_BY_ID query with success response
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrgByIdQuery }>({
          data: {
            organization: [
              {
                id: chance.guid(),
                name: orgName,
                address: {},
              },
            ],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/auto-register" element={<AutoRegisterPage />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/auto-register?token=${chance.guid()}`] }, // set token
    )

    const suspenseLoadingSelector = screen.queryByTestId('suspense-loading')
    const autoRegisterFormSelector = screen.getByTestId('auto-register-form')

    // ensure Suspense Loading is not rendered
    expect(suspenseLoadingSelector).not.toBeInTheDocument()

    // ensure the Form is rendered
    expect(autoRegisterFormSelector).toBeInTheDocument()
  })

  it('does not display the *Auto-Register* form, when route has no token', () => {
    // mock GET_ORG_BY_ID query
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrgByIdQuery }>({
          data: {
            organization: [
              {
                id: chance.guid(),
                name: orgName,
                address: {},
              },
            ],
          },
        }),
    } as unknown as Client
    render(
      <Provider value={client}>
        <Routes>
          <Route path="/auto-register" element={<AutoRegisterPage />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/auto-register`] }, // don't pass any token
    )

    const suspenseLoadingSelector = screen.getByTestId('suspense-loading')
    const autoRegisterFormSelector = screen.queryByTestId('auto-register-form')

    // ensure Suspense Loading is rendered
    expect(suspenseLoadingSelector).toBeInTheDocument()

    // ensure the Form is not rendered
    expect(autoRegisterFormSelector).not.toBeInTheDocument()
  })

  it('does not display the *Auto-Register* form, when GET_ORG_BY_ID query returns an error', () => {
    // mock query with error
    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_ORG_BY_ID) {
          return fromValue({
            error: new CombinedError({
              networkError: Error('something went wrong!'),
            }),
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/auto-register" element={<AutoRegisterPage />} />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [
          `/auto-register?token=${chance.guid()}&orgId=${chance.guid()}`,
        ],
      }, // set token
    )

    const suspenseLoadingSelector = screen.getByTestId('suspense-loading')
    const autoRegisterFormSelector = screen.queryByTestId('auto-register-form')

    // ensure Suspense Loading is rendered
    expect(suspenseLoadingSelector).toBeInTheDocument()

    // ensure the Form is not rendered
    expect(autoRegisterFormSelector).not.toBeInTheDocument()
  })

  it('displays the Organization name to which user has been invited, on the *Residing Organization* field', () => {
    const orgName = chance.name()
    const loadProfileMock = vi.fn().mockResolvedValue(buildProfile())

    useAuthMock.mockReturnValue({
      loadProfile: loadProfileMock,
      acl: {
        isAustralia: vi.fn().mockReturnValue(false),
        isUK: vi.fn().mockReturnValue(true),
      },
    } as unknown as AuthContextType)

    const orgId = chance.guid()

    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrgByIdQuery }>({
          data: {
            organization: [
              {
                id: orgId,
                name: orgName,
                address: {},
              },
            ],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/auto-register" element={<AutoRegisterPage />} />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [
          `/auto-register?token=${chance.guid()}&orgId=${orgId}`,
        ],
      },
    )

    const autoRegisterFormSelector = screen.queryByTestId('auto-register-form')
    const orgNameSelector = screen
      .getByTestId('org-name')
      .querySelector('input')

    expect(autoRegisterFormSelector).toBeInTheDocument()
    expect(orgNameSelector).toHaveValue(orgName)
  })
})
