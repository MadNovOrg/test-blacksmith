import sanitize from 'sanitize-html'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { GetOrganisationDetailsForDeleteQuery } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import DeleteOrgModal from '@app/modules/organisation/components/DeleteOrgModal/DeleteOrgModal'
import { AwsRegions } from '@app/types'

import { _render, renderHook, screen } from '@test/index'
import { chance } from '@test/index'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe(`${DeleteOrgModal.name} on ANZ`, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useScopedTranslation('pages.org-details.tabs.details'))

  it('should _render the modal with correct content if delete is allowed', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 0 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 0 } },
              affiliatedOrgs: { aggregate: { count: 0 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = _render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>,
    )

    const sanitizedOrgName = sanitize(org.name)

    expect(
      getByText(
        t('confirm-deleting', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).toBeInTheDocument()
    expect(screen.getByTestId('delete-org-btn')).toBeInTheDocument()
  })

  it('should _render the modal with correct content if delete is NOT allowed', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 0 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 1 } },
              affiliatedOrgs: { aggregate: { count: 0 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = _render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>,
    )

    const sanitizedOrgName = sanitize(org.name)

    expect(
      getByText(
        t('cannot-be-deleted-with-main-org', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(
        t('confirm-deleting', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).not.toBeInTheDocument()

    expect(screen.queryByTestId('delete-org-btn')).not.toBeInTheDocument()
  })

  it('should _render the modal with correct organisation linked entities', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 1 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 1 } },
              affiliatedOrgs: { aggregate: { count: 3 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = _render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>,
    )

    const sanitizedOrgName = sanitize(org.name)

    expect(
      getByText(
        t('cannot-be-deleted-with-main-org', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).toBeInTheDocument()

    expect(getByText(t('count-members', { num: 1 }))).toBeInTheDocument()
    expect(getByText(t('count-orders', { num: 1 }))).toBeInTheDocument()
    expect(
      screen.queryByText(t('count-courses', { num: 0 })),
    ).not.toBeInTheDocument()
    expect(getByText(t('count-affiliatedOrgs', { num: 3 }))).toBeInTheDocument()

    expect(
      screen.queryByText(
        t('confirm-deleting', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-org-btn')).not.toBeInTheDocument()
  })
})

describe(`${DeleteOrgModal.name} on UK`, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useScopedTranslation('pages.org-details.tabs.details'))

  it('should _render the modal with correct content if delete is allowed', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 0 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 0 } },
              affiliatedOrgs: { aggregate: { count: 0 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = _render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>,
    )

    const sanitizedOrgName = sanitize(org.name)

    expect(
      getByText(
        t('confirm-deleting', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).toBeInTheDocument()
    expect(screen.getByTestId('delete-org-btn')).toBeInTheDocument()
  })

  it('should _render the modal with correct content if delete is NOT allowed', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 0 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 1 } },
              affiliatedOrgs: { aggregate: { count: 0 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = _render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>,
    )

    const sanitizedOrgName = sanitize(org.name)

    expect(
      getByText(
        t('cannot-be-deleted', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(
        t('confirm-deleting', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).not.toBeInTheDocument()

    expect(screen.queryByTestId('delete-org-btn')).not.toBeInTheDocument()
  })

  it('should _render the modal with correct organisation linked entities', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 1 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 1 } },
              affiliatedOrgs: { aggregate: { count: 0 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = _render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>,
    )

    const sanitizedOrgName = sanitize(org.name)

    expect(
      getByText(
        t('cannot-be-deleted', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).toBeInTheDocument()

    expect(getByText(t('count-members', { num: 1 }))).toBeInTheDocument()
    expect(getByText(t('count-orders', { num: 1 }))).toBeInTheDocument()
    expect(
      screen.queryByText(t('count-courses', { num: 0 })),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(
        t('confirm-deleting', {
          interpolation: { escapeValue: false },
          name: sanitizedOrgName,
        }),
      ),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-org-btn')).not.toBeInTheDocument()
  })
})
